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
@bot.command(name='newevent', aliases=['addevent','plan','setevent'], help="Adds a new event to the current server's schedule. Optional event name with command.")
async def newEvent(ctx, *inputEventMsg):
	# nested fuction, to use in secondary queries to only respond to same user
	def verifyUser(newMessage):
		return newMessage.author == ctx.author
	# admin check, short circuit this with AND until final decision
	if not ctx.message.author.guild_permissions.administrator and False:
		msg = "You're not an admin {0.author.mention}, so you can't call this command".format(ctx.message)  
		await ctx.send(msg)
		return
	# if user did not give any argument with command, query for event name
	if len(inputEventMsg) == 0:
		await ctx.send('Enter name of the event to be planned.')
		inputEventMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		eventName = inputEventMsg.content
	# otherwise, turn tuple argument into one string
	else:
		eventName = ' '.join(inputEventMsg)
	# if there's already an entry with this name for this server, end
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

@newEvent.error
async def newEventError(ctx, error):
	# only give specific response for timeout, dont think anything else worth it
	if isinstance(error.original, asyncio.exceptions.TimeoutError):
		await ctx.send('Error: no response / time-out.')
	else: 
		await ctx.send('Error: bad date or bad time entered.')

# delEvent will access firebase db and delete matching event folder for specific server
@bot.command(name='deleteevent', aliases=['removeevent','cancelevent','unplan','delevent'], help="Deletes an event from the server's schedule. Optional event name with command.")
async def delEvent(ctx, *inputEventMsg):
	def verifyUser(newMessage):
		return newMessage.author == ctx.author
	# admin check, short circuit this with AND until final decision
	if not ctx.message.author.guild_permissions.administrator and False:
		msg = "You're not an admin {0.author.mention}, so you can't call this command.".format(ctx.message)  
		await ctx.send(msg)
		return
	# if no argument given, query for event name
	if len(inputEventMsg) == 0:
		await ctx.send('Enter eventName of the event to be removed.')
		inputEventMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		eventName = inputEventMsg.content
	# else, turn tuple argument into one string
	else:
		eventName = ' '.join(inputEventMsg)
	# check if event name is used, and delete it
	if db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).shallow().get().val():
		db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).remove()
		await ctx.send('Removed event "' + eventName + '".')
	else:
		await ctx.send('Event "' + eventName + '" does not exist!')

@delEvent.error
async def delEventError(ctx, error):
	# only give specific response for timeout, dont think anything else worth it
	if isinstance(error.original, asyncio.exceptions.TimeoutError):
		await ctx.send('Error: no response / time-out.')
	else: 
		await ctx.send('Error: bad date or bad time entered.')

# listEvents will access firebase db and list all events found for specific server
@bot.command(name='schedule',aliases=['showevents','showschedule','showplan','showplanned','listevents'], help="Lists all events in the server's schedule.")
async def listEvents(ctx):
	guildAllEvents = db.child(ctx.guild.id).child(FOLDER_STR).get().val()
	# working null db check
	if guildAllEvents is not None:
		await ctx.send("All events scheduled in server '" + ctx.guild.name + "':")
		for eventFolder in guildAllEvents:
			await ctx.send(eventFolder + " at: " + guildAllEvents[eventFolder]['date'] + ".")
	else:
		await ctx.send("There are no events to list!")

# comment this out for release?
@bot.command(name='shutdown', help='Shuts down the bot across all servers.')
async def shutdown(ctx):
	# admin check, needed for shutdown but this impacts all servers
	if not ctx.message.author.guild_permissions.administrator:
		msg = "You're not an admin {0.author.mention}, so you can't use this command.".format(ctx.message)  
		await ctx.send(msg)
		return
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
					# get a datetime obj for current time to compare with events, local time + tz naive
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
							# 30 minute reminder, ex if event is 12:00 pm remind at (11:29:00 am, 11:30:00 am] w/ 60 second check interval
							if (eventDateTime - timedelta(minutes=31)) < currDateTime <= (eventDateTime - timedelta(minutes=30)):
								destinationChannel = bot.get_channel(guildAllEvents[eventFolder]['channel'])
								if destinationChannel is not None:
									await destinationChannel.send("@everyone, " + eventFolder + " starts in 30 minutes!")
		# keep loop alseep for 60 seconds
		await asyncio.sleep(60)

botStartTime = datetime.now()
print(botStartTime)
# main, note that checkSchedule() will run before bot start-up and old events will be deleted with no message 
bot.loop.create_task(checkSchedule())
botStarted = True
bot.run(TOKEN)
print("Bot off")