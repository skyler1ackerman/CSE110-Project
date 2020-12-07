import discord
import pyrebase
import asyncio
import time
from datetime import datetime, timedelta, timezone
from config import fireConfig
from discord.ext import commands


# class variables
firebase = pyrebase.initialize_app(fireConfig)
db = firebase.database()
client = discord.Client()

# class constants
FOLDER_STR = "Events"

# bot functions. the '@' line is important where it is used.
def setup(bot):
	bot.add_cog(EventBot(bot))

class EventBot(commands.Cog):
	def __init__(self, bot):
		self.bot = bot
		self.bot.loop.create_task(self.checkSchedule())

	# newEvent will add a new event folder with data to firebase db given user input, for specific server folder
	@commands.command(aliases=['addevent', 'addEvent', 'newevent', 'adde', 'addE', 'newe', 'newE'], help='Adds a new assignment to the server. Format: !addAssign <EventName> (Optional)')
	async def newEvent(self, ctx, *inputEventMsg):
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
			inputEventMsg = await self.bot.wait_for("message", timeout=30, check=verifyUser)
			eventName = inputEventMsg.content
		# otherwise, turn tuple argument into one string
		else:
			eventName = ' '.join(inputEventMsg)
		# if there's already an entry with this name for this server, end
		if db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).shallow().get().val():
			await ctx.send('Event "' + eventName + '" already exists!')
		else:
			# take user input for date and time, only accept same user's input
			await ctx.send("Enter date of event, MM DD YYYY (spaces required).")
			eventDateMsg = await self.bot.wait_for("message", timeout=30, check=verifyUser)
			await ctx.send("Enter time of event, HH MM (pm/am) (spaces required).")
			eventTimeMsg = await self.bot.wait_for("message", timeout=30, check=verifyUser)
			# parse user input to generate datetime object, set format string
			eventDateTime = datetime.strptime(eventDateMsg.content + " " + eventTimeMsg.content, '%m %d %Y %I %M %p')
			db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).child("date").set(eventDateTime.isoformat(' '))
			# get channel for event announcements, by taking command's current channel
			db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).child("channel").set(ctx.channel.id)
			# get user who called command, might be useful for RSVP feature
			db.child(ctx.guild.id).child(FOLDER_STR).child(eventName).child("users").set(ctx.author.id)
			await ctx.send('Added event "' + eventName + '", scheduled for: ' + eventDateTime.ctime() + '.')

	@newEvent.error
	async def newEventError(self, ctx, error):
		# only give specific response for timeout, dont think anything else worth it
		if isinstance(error.original, asyncio.exceptions.TimeoutError):
			await ctx.send('Error: no response / time-out.')
		elif isinstance(error.original, ValueError):
			await ctx.send('Error: bad date or bad time entered.')
		else:
			print(error)
			await ctx.send('Error: unknown error.')

	# delEvent will access firebase db and delete matching event folder for specific server
	@commands.command(aliases=['delevent', 'deleteevent', 'deleteEvent', 'dele', 'delE', 'deletee', 'deleteE'], help="Deletes an event from the server's schedule. Format !delEvent <EventName> (Optional)")
	async def delEvent(self, ctx, *inputEventMsg):
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
			inputEventMsg = await self.bot.wait_for('message', timeout=30, check=verifyUser)
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
	async def delEventError(self, ctx, error):
		# only give specific response for timeout, dont think anything else worth it
		if isinstance(error.original, asyncio.exceptions.TimeoutError):
			await ctx.send('Error: no response / time-out.')
		else: 
			print(error)
			await ctx.send('Error: unknown error.')

	# listEvents will access firebase db and list all events found for specific server
	@commands.command(aliases = ['listevents', 'listE', 'liste', 'allevents', 'allEvents'], help="Lists all events in the server's schedule. Format: !listEvents")
	async def listEvents(self, ctx):
		guildAllEvents = db.child(ctx.guild.id).child(FOLDER_STR).get().val()
		# working null db check
		if guildAllEvents is not None:
			await ctx.send("All events scheduled in server '" + ctx.guild.name + "':")
			for eventFolder in guildAllEvents:
				await ctx.send(eventFolder + ": " + guildAllEvents[eventFolder]['date'] + ".")
		else:
			await ctx.send("There are no events to list!")

	# functions
	# checkSchedule will access firebase db to see if any events have passed, all servers
	# will send discord msg and delete said event's folder
	async def checkSchedule(self):
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
								destinationChannel = self.bot.get_channel(guildAllEvents[eventFolder]['channel'])
								if destinationChannel is not None:
									await destinationChannel.send("@everyone, " + eventFolder + " has started at: " + eventDateTime.ctime() + ".")
								# delete event since its over and no more reminders, need correct type
								db.child(childGuild).child(FOLDER_STR).child(eventFolder).remove()
							else:
								# insert secondary reminder alerts here
								# 30 minute reminder, w/ 60 second check interval and millisec precision
								# ex. if event is 12:00 pm remind at (11:29:00 am, 11:30:00 am] 
								if (eventDateTime - timedelta(minutes=31)) < currDateTime <= (eventDateTime - timedelta(minutes=30)):
									destinationChannel = bot.get_channel(guildAllEvents[eventFolder]['channel'])
									if destinationChannel is not None:
										await destinationChannel.send("@everyone, " + eventFolder + " starts in 30 minutes!")
			# keep loop alseep for 60 seconds
			await asyncio.sleep(60)