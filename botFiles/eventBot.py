import discord
import pyrebase
import asyncio
import time
from datetime import datetime, timedelta, timezone
from config import fireConfig
from config import TOKEN
from discord.ext import commands, tasks

# class variables
firebase = pyrebase.initialize_app(fireConfig)
auth = firebase.auth()
db = firebase.database()
bot = commands.Bot(command_prefix='!')
client = discord.Client()
utcDelta = timedelta(0, time.timezone)
localTimezone = timezone(utcDelta)
botStarted = False

# class constants
FOLDER_STR = "Events"

# bot functions. the '@' line is important where it is used.

# start up routine, console message
@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')

# newEvent will add a new event folder with data to firebase db given user input, for specific server folder
@bot.command(name='setevent', aliases=['addevent','newevent','plan'], help="Adds a new event to the current server's schedule. Optional event name with command.")
async def newEvent(ctx, *inputEventMsg):
	def verifyUser(newMessage):
		return newMessage.author == ctx.author
	if len(inputEventMsg) == 0:
		await ctx.send('Enter name of the event to be planned.')
		inputEventMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		eventName = inputEventMsg.content
	else:
		eventName = ' '.join(inputEventMsg)

	if db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).shallow().get().val():
		await ctx.send('Event "' + eventName + '" already exists!')
	else:
		## take user input for date and time, only accept same user's input
		await ctx.send("Enter date of event, MM DD YYYY (spaces required).")
		eventDateMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		await ctx.send("Enter time of event, HH MM (pm/am) (spaces required).")
		eventTimeMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		## parse user input to generate datatime object
		eventDateTime = datetime.strptime(eventDateMsg.content + " " + eventTimeMsg.content, '%m %d %Y %I %M %p')
		db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).child("date").set(eventDateTime.isoformat(' '))
		# get channel for event announcements, by taking command's current channel
		db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).child("channel").set(ctx.channel.id)
		# get user who called command, might be useful for RSVP feature
		db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).child("users").set(ctx.author.id)
		await ctx.send('Added event "' + eventName + '", scheduled for: ' + eventDateTime.ctime() + '.')

# delEvent will access firebase db and delete matching event folder for specific server
@bot.command(name='deleteevent', aliases=['removeevent','cancelevent','unplan'], help="Deletes an event from the server's schedule. Optional event name with command.")
async def delEvent(ctx, *inputEventMsg):
	def verifyUser(newMessage):
		return newMessage.author == ctx.author
	if len(inputEventMsg) == 0:
		await ctx.send('Enter eventName of the event to be removed.')
		inputEventMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		eventName = inputEventMsg.content
	else:
		eventName = ' '.join(inputEventMsg)
		
	if db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).shallow().get().val():
		db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).remove()
		await ctx.send('Removed event "' + eventName + '".')
	else:
		await ctx.send('Event "' + eventName + '" does not exist!')

# listEvents will access firebase db and list all events found for specific server
@bot.command(name='schedule',aliases=['showevents','showschedule','showplan'], help="Lists all events in the server's schedule.")
async def listEvents(ctx):
	guildAllEvents = db.child(ctx.guild.id).child(FOLDER_STR).get().val()
	# working null db check
	if guildAllEvents is not None:
		await ctx.send("All events scheduled in server '" + ctx.guild.name + "':")
		for eventFolder in guildAllEvents:
			await ctx.send(eventFolder + " at: " + guildAllEvents[eventFolder]['date'] + ".")
	else:
		await ctx.send("There are no events to list!")


@bot.command(name='shutdown', help='Shuts down the bot across all servers.')
async def shutdown(ctx):
	await ctx.send('Shutting down ' + bot.user.name + "!")
	await ctx.bot.logout()

# functions
# checkSchedule will access firebase db to see if any events have passed, all servers
# will send discord msg and delete said event's folder
async def checkSchedule():
	while(True):
		# sanity check
		if db.get().val() is not None:
			for childGuild in db.get().val():
				# save a ordereddict of strings for easy access, cant call methods
				guildAllEvents = db.get().val()[childGuild][FOLDER_STR]
				# working null db check
				if guildAllEvents is not None:
					# get a datetime obj for current time to compare with events
					currDateTime = datetime.now()
					# loop through all events, finish up started events and maybe remind
					for eventFolder in guildAllEvents:
						# make datetime object for current event
						eventDateTime = datetime.fromisoformat(guildAllEvents[eventFolder]['date'])
						# if event start-time passed, send message to channel that event was made in
						if eventDateTime < currDateTime:
							destinationChannel = bot.get_channel(guildAllEvents[eventFolder]['channel'])
							if destinationChannel is not None:
								await destinationChannel.send("@everyone, " + eventFolder + " has started at: " + eventDateTime.ctime() + ".")
							# delete event since its over and no more reminders, need correct type
							db.child(childGuild).child(FOLDER_STR).child(eventFolder).remove()
						else:
							# insert secondary reminder alerts here
							dummy = 0
		# keep loop alseep for 60 seconds
		await asyncio.sleep(60)

# main, note that checkSchedule() will run before bot start-up and old events will be deleted with no message 
bot.loop.create_task(checkSchedule())
botStarted = True
bot.run(TOKEN)
print("Bot off")