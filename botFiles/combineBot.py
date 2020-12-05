import discord
import asyncio
import datetime
import pyrebase
import re
import time
from dotenv import load_dotenv
from discord.ext import commands, tasks
from config import TG_TOKEN as TOKEN
from config import fireConfig
from discord.ext import commands, tasks
from datetime import datetime, timedelta, timezone
from urllib import request


intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents)

# Let's me know that the bot is ready
@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')

# Report Bot ===========================================================================

# This function gets called when the admin approves deleting a reported message
async def delMsg(susMsg, reportMsg, reportMsgList):
	# We do a try except loop to avoid the edge case where another mod already deleted the given message
	try:
		# Tell the admin that we received the command to delete, then delete the message
		await reportMsg.channel.send('Deleting message "' + susMsg.content + '"')
		await susMsg.delete()
	# If someone already manually deleted the message we would hit an error. This is just to avoid that.
	except discord.errors.NotFound:
		await reportMsg.channel.send('That message has already been deleted!')
	# Send a message to every admin besides the one that deleted the message letting them know it got deleted.
	for channel in [msg.channel for msg in reportMsgList if msg.channel.recipient != reportMsg.channel.recipient]:
		await channel.send(str(reportMsg.channel.recipient) + ' deleted message "' + susMsg.content + '"')

# This function gets called when the admin rejects deleting a reported message
async def keepMsg(susMsg, reportMsg, reportMsgList):
	# We do a try except loop to avoid the edge case where another mod already deleted the given message
	try:
		# Tell the admin that we received the command to allow the message
		await reportMsg.channel.send('Ignoring message "' + susMsg.content + '"')
	# If someone already manually deleted the message we would hit an error. This is just to avoid that.
	except discord.errors.NotFound:
		await reportMsg.channel.send('That message has already been deleted!')
	# Send a message to every admin besides the one that allowed the message letting them know it was ignored.
	for channel in [msg.channel for msg in reportMsgList if msg.channel.recipient != reportMsg.channel.recipient]:
		await channel.send(str(reportMsg.channel.recipient) + ' ignored message "' + susMsg.content + '"')

# This function is called after the report is sent to the admin
# It waits for the admin to react with a check or x
async def waitGen(reportMsgList, susMsg):
	# The admin can react with a check to delete the message, or an x to keep the message
	optionDict = {'✅':delMsg,'❌':keepMsg}
	# Checks that the admin reacted with one of the two options
	def check(react, user_):
		# We check that A. They reacted with one of the two emojis
		# B. The reaction was on the correct report message
		# C. There are two reactions (The bot's and the admins)
		return str(react.emoji) in optionDict.keys() and react.message.id in [msg.id for msg in reportMsgList] and react.count == 2
	# The bot will wait for the admin to react to the report message until the timeout
	# The timeout can be removed if we want it to wait forever, but I advise against that
	try:
		reportReact, reportAdmin = await bot.wait_for('reaction_add', timeout=60, check=check)
	# If the wait times out, simply continue
	except asyncio.TimeoutError:
		pass
	# If the wait returns true, then run the function corresponding to the given emoji
	else:
		await optionDict[reportReact.emoji](susMsg, reportReact.message, reportMsgList)

# This function is called when a user 'flags' a message, AKA reacts with a red square
async def sendReport(reaction, user):
	# The flagged message
	susMsg = reaction.message
	# Immediately remove the flag so that not everyone on the server can see who flagged
	await reaction.remove(user)
	# Get a list of all of the admins in the guild
	adminsList = [admin for admin in susMsg.guild.members if admin.guild_permissions.administrator and not admin.bot]
	# Loop through all the admins
	reportMsgList = []
	for admin in adminsList:
		# Send a report to the admin including who reported who, the message, the time, and instructions
		try:
			# If there isn't already a dm_channel between the bot and the user, create one
			if not admin.dm_channel:
				await admin.create_dm()
			reportMsg = await admin.dm_channel.send(user.name + ' reported ' + susMsg.author.name + 
			' for the following message:\n"' + susMsg.content + '"\nSent ' + 
			(susMsg.created_at + datetime.timedelta(hours=4)).strftime("%A, %B %d at %H:%M") +
			'\nPlease react with a ✅ to delete the reported message, or a ❌ to do nothing')
			# Prepopulate the message with the two options. This makes it easier for the admin to remove/keep a message
			await reportMsg.add_reaction('✅')
			await reportMsg.add_reaction('❌')
			# Make a list of all of the messages that went out to admins
			reportMsgList.append(reportMsg)
		except (discord.errors.Forbidden,discord.errors.HTTPException):
			print('Skipping user', admin.name)
			pass
		# Wait for the admin report 
	await waitGen(reportMsgList, susMsg)

# Runs whenever a new reaction is added
@bot.event
async def on_reaction_add(reaction, user):
	# This is a dictionary of all of the emojis that the bot checks for.
	# Right now it's just the red flag
	optionDict = {'🟥': sendReport}
	# If the emoji sent is in the dict.keys(), it will run that function
	try:
		await optionDict[reaction.emoji](reaction, user)
	# Otherwise, it will ignore it
	except KeyError:
		pass

# Regular shut down of the bot
@bot.command(name='s',help='Shuts down the script')
async def shutdown(ctx):
	if(ctx.author.name == 'thomasm16'):
			await ctx.send('Shutting down ReportBot')
			await ctx.bot.logout()
	else:
		await ctx.send('Nice try')

# Assignment Bot ==========================================

#used skylers skeleton
def make_datetime(lst):
    date_str = lst[1]
    return datetime.strptime(date_str, '%m/%d/%Y')

firebase = pyrebase.initialize_app(fireConfig)
auth = firebase.auth()
db = firebase.database()

load_dotenv()
GUILD= 'CSE110 Bot Testing'

top = "Assignments"

#!addAssign "assignment name" mm/dd/yyyy
@bot.command(name='addAssign', help='Adds a new assignment to the list')
async def newEvent(ctx, name=None):
	content = ctx.message.content
	#check for proper name format
	if name and (content.count('\"') == 2):
		title = content.split('"')[1].strip()
		date1 = content[content.rindex('"')+1:].strip()
		#strip out mm/dd/yyyy format from following 
		dateFound = re.search('(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}' , date1)
		#check date format, if date at all, if empty quotes
		if dateFound and title:
			#check if assignment name already exists in db
			if db.child(ctx.guild.id).child(top).child(title).shallow().get().val():
				await ctx.send('Assignment "' + name + '" already exists!')
			else:
				db.child(ctx.guild.id).child(top).child(title).set(''.join(str(dateFound.group())))
				await ctx.send('Added assignment "' + name + '"')
		else:
			await ctx.send('Please use the format: !addAssign "Assignment Name" mm/dd/yyyy')
	else:
		await ctx.send('Please use the format: !addAssign "Assignment Name" mm/dd/yyyy')

#!delAssign "assignment name"
@bot.command(name='delAssign', help='Deletes an assignment from the list')
async def delEvent(ctx, name=None):
	content = ctx.message.content
	#check empty argument and in quotes
	if name is not None and (content.count('\"') == 2):
		titleDel = content.split('"')[1].strip()
		#check empty quotes
		if titleDel:
			#check exists then removes from db
			if db.child(ctx.guild.id).child(top).child(titleDel).shallow().get().val():
				db.child(ctx.guild.id).child(top).child(titleDel).remove()
				await ctx.send('Removed assignment "' + titleDel + '"')
			else:
				await ctx.send('Assignment "' + name + '" does not exist')
		else:
			await ctx.send('Please use the format: !delAssign "Assignment Name"')
	else:
			await ctx.send('Please use the format: !delAssign "Assignment Name"')

#!listAssign
@bot.command(name='listAssign', help='Lists all assignments')
async def listEvents(ctx):
	if db.child(ctx.guild.id).child(top).shallow().get():
		newDate = {}
		assignArray = []
		allAssign = db.child(ctx.guild.id).child(top).get().val()
		for guildID in db.get().val():
			if int(guildID) == ctx.guild.id:
				for assignment in db.get().val()[guildID]['Assignments']:
					newDate[assignment] = db.get().val()[guildID]['Assignments'][assignment]
				newData = list(newDate.items())
				sortedData = sorted(newData, key=make_datetime)
				for x, y in sortedData:
					await ctx.send(y+': '+x)
	else:
		await ctx.send("There are no assignments to list!")

async def checkSchedule():
	while(True):
		# sanity check
		if db.get().val() is not None:
			for guildID in db.get().val():
				for assignment in db.get().val()[guildID]['Assignments']:
					date = datetime.strptime(db.get().val()[guildID]['Assignments'][assignment], '%m/%d/%Y')
					currDateTime = datetime.today()
					if date.date() == currDateTime.date():
						guild = bot.get_channel(int(guildID))
						if guild:
							await guild.channels[0].send("@everyone, " + assignment + " is due today.")
					elif date.date() < currDateTime.date():
						guild = bot.get_channel(int(guildID))
						if guild:
							await guild.channels[0].send("@everyone, " + assignment + " was due.")
							db.child(guildID).child(top).child(assignment).remove()

#		# keep loop asleep for 8 hours
		await asyncio.sleep(28800)
## main, note that checkSchedule() will run before bot start-up and old events will be deleted with no message 
bot.loop.create_task(checkSchedule())


# Event Bot ==========================================

# class constants
FOLDER_STR = "Events"

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
		# take user input for date and time, only accept same user's input
		await ctx.send("Enter date of event, MM DD YYYY (spaces required).")
		eventDateMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		await ctx.send("Enter time of event, HH MM (pm/am) (spaces required).")
		eventTimeMsg = await bot.wait_for("message", timeout=30, check=verifyUser)
		# parse user input to generate datetime object, set format string
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
	elif isinstance(error.original, ValueError):
		await ctx.send('Error: bad date or bad time entered.')
	else:
		print(error)
		await ctx.send('Error: unknown error.')

# delEvent will access firebase db and delete matching event folder for specific server
@bot.command(name='deleteevent', aliases=['removeevent','cancelevent','unplan','delevent'], help="Deletes an event from the server's schedule. Optional event name with command.")
async def delEvent(ctx, *inputEventMsg):
	def verifyUser(newMessage):
		return newMessage.author == ctx.author
	# admin check, short circuit this with AND until final decision
	if not ctx.message.author.guild_permissions.administrator and False:
		msg = "Whoops {0.author.mention}, you aren't an admin! If you an admin nicely, they might add and event for you.".format(ctx)  
		await ctx.send(msg)
		return
	# if no argument given, query for event name
	if len(inputEventMsg) == 0:
		await ctx.send('Enter the name of the event to be removed.')
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
		await ctx.send('Sorry {0}, you waited too long and I got bored!'.format(ctx.author.mention))
	else: 
		print(error)
		await ctx.send('Sorry {0}, something went wrong!'.format(ctx.author.mention))

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

# functions
# checkSchedule will access firebase db to see if any events have passed, all servers
# will send discord msg and delete said event's folder
async def checkSchedule():
	while(True):
		# sanity check
		if db.get().val() is not None:
			for childGuild in db.get().val():
				# save a ordered dict of strings for easy access, cant call methods
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
							# 30 minute reminder, w/ 60 second check interval and millisec precision
							# ex. if event is 12:00 pm remind at (11:29:00 am, 11:30:00 am] 
							if (eventDateTime - timedelta(minutes=31)) < currDateTime <= (eventDateTime - timedelta(minutes=30)):
								destinationChannel = bot.get_channel(guildAllEvents[eventFolder]['channel'])
								if destinationChannel is not None:
									await destinationChannel.send("@everyone, " + eventFolder + " starts in 30 minutes!")
		# keep loop alseep for 60 seconds
		await asyncio.sleep(60)

# main, note that checkSchedule() will run before bot start-up and old events will be deleted with no message 
bot.loop.create_task(checkSchedule())

# RuleBot ===============================================

@bot.command(aliases = ['rules', 'Rule', 'Rules'])
async def rule(ctx, a = None):
    newDict = {}
    all_guilds = db.child("guilds").get().each()
    gid = ctx.guild.id
    guildExists = False

    # check if guilds exists, then check if guild exists in those guilds list
    # get guild rules if guild exists, else get default rules
    if all_guilds:
        for guild in all_guilds:
            if gid == int(guild.key()):
                newDict = rules_Dict(gid, None, None)[0]
                guildExists = True
    if not guildExists:
        newDict = default_Dict()

    count = len(newDict)
    # stringCount = 0

    # if no arguemnt, list all rules, else if check for bad input
    # if no bad input, jump to else section
    if a == None:
        # list every rule in a separate 
        for i in range(count):
            # if stringCount == 10:
            rulestr = ""
            rulestr = "" + str(i) + ". "+ newDict[i]["title"] + ": " + newDict[i]["desc"]
            await ctx.send(rulestr)
    elif not a.isnumeric():
        await ctx.send("Error: Not a positive number." + '\n' + "Please enter a non-negative number to view a specific rule, or no number to view all rules.")
    elif int(a) >= count:
        await ctx.send("Error: We do not have that many rules!")
    elif int(a) < 0:
        await ctx.send("Error: Must be a non-negative number.")
    else:
        x = int(a)
        print(type(str(x)))
        rulestr = "" + str(x) + ". "+ newDict[x]["title"] + ": " + newDict[x]["desc"]
        await ctx.send(rulestr)
        

@bot.command(aliases = ['deleteRule', 'deleterule'])
async def delete_rule(ctx, a = None):
    guildExists = False
    newDict = {}
    gid = ctx.guild.id
    all_guilds = db.child("guilds").get().each()

    if a == None:
        await ctx.send("Please enter a rule number to delete. If you do not know the number for a rule, enter !rules to see all the rules with their numbers.")
    elif not a.isnumeric():
        await ctx.send("Please enter a rule number to delete.")
    elif int(a) == 0:
        await ctx.send("Cannot delete rule 0: the welcome message.")
    else:
        if all_guilds:
            for guild in all_guilds:
                if gid == int(guild.key()):
                    newDict = delete_element(rules_Dict(gid)[0], int(a))
                    guildExists = True
                    if int(a) > len(newDict)-1:
                        await ctx.send("Invalid rule number.")
                        return
                    # db.child("guild").child(gid).remove()
                    db.child("guilds").child(gid).set(newDict)
                    await ctx.send("Rule deleted successfully.")
        if not guildExists:
            newDict = delete_element(default_Dict(), int(a))
            if int(a) > len(newDict)-1:
                await ctx.send("There are not that many rules")
                return
            db.child("guilds").child(gid).set(newDict)
            await ctx.send("Rule deleted successfully.")


@bot.command(aliases = ['swaprule', 'swapRule', 'swaprules', 'swapRules'])
async def swap_rule(ctx, a = None, b = None):
    guildExists = False
    newDict = {}
    gid = ctx.guild.id
    all_guilds = db.child("guilds").get().each()              
    
    if a == None or b == None:
        await ctx.send("Error: Please enter two rule numbers to swap.")
    elif not a.isnumeric():
        await ctx.send("Error: First value to swap is not numeric.")
    elif not b.isnumeric:
        await ctx.send("Error: Second value to swap is not numeric.")
    elif int(a) == 0 or int(b) == 0:
        await ctx.send("Error: Cannot swap rule 0: the welcome message")
    else:
        x,y = int(a), int(b)
        if all_guilds:
            for guild in all_guilds:
                if gid == int(guild.key()):
                    newDict = rules_Dict(gid)[0]
                    index = len(newDict) - 1
                    if x > index or y > index:
                        await ctx.send("Error: Number(s) too big. There are not that many rules.")
                        return
                    swap_elements(newDict, x, y)
                    db.child("guilds").child(gid).set(newDict)
                    await ctx.send("Rules swapped successfully")
                    guildExists = True
                    break               
        if not guildExists:
            newDict = default_Dict()
            swap_elements(newDict, x, y)
            db.child("guilds").child(gid).set(newDict)
            await ctx.send("Rules swapped successfully")


@bot.command(aliases = ['addRule', 'addrule'])
async def add_rule(ctx, *, args = None):
    newDict = {}
    guildExists = False
    gid = ctx.guild.id
    all_guilds = db.child("guilds").get().each()
    
    content = ctx.message.content
    newTitle = "**" + content.split('"')[1].strip() + "**"
    newDesc = content[content.rindex('"')+1:].strip()
    
    if not args:
        await ctx.send("Please enter a rule title and rule description with the format:\n!addrule \"title\" description")
    elif content.count('\"') != 2 or args[0] != '"':
        await ctx.send("Please enclose only the rule title in parentheses. There must be two parentheses in a command. The format to add a new rule is:\n!addrule \"title\" description")
    elif args[0] == '"' and args[1] == '"':
        await ctx.send("The rule must have a title. Please use the following format to add a new rule:\n!addrule \"title\" description")
    else:
        if all_guilds:
            for guild in all_guilds:
                if gid == int(guild.key()):
                    newDict = rules_Dict(gid, newTitle, newDesc)[0]
                    update = rules_Dict(gid, newTitle, newDesc)[1]
                    count = len(newDict)
                    if not update:
                        newDict[count] = {"index": count, "desc": newDesc, "title": newTitle}
                    db.child("guilds").child(gid).set(newDict)
                    guildExists = True
                    await ctx.send("Rule added successfully!")
                    break
        if not guildExists:
            newDict = default_Dict()
            count = len(newDict)
            newDict[count] = {"index": count, "desc": newDesc, "title": newTitle}
            db.child("guilds").child(gid).set(newDict)
            guildExists = True
            await ctx.send("Rule added successfully!")

def default_Dict():
    retDict = {}
    defRules = db.child("default").get().each()
    for i in range(len(defRules)):
        retDict[i] = {"index": defRules[i].val()["index"], "desc": defRules[i].val()["desc"], "title": defRules[i].val()["title"]}
    return retDict


def rules_Dict(guildNum, title = None, desc = None):
    index = 0
    retDict = {}
    updated = False
    guildRules = db.child("guilds").child(guildNum).get().each()

    for i in range(len(guildRules)):
        if not guildRules[i].val() == None:
            retDict[index] = {"index": guildRules[i].val()["index"], "desc": guildRules[i].val()["desc"], "title": guildRules[i].val()["title"]}
            if retDict[i]["title"] == title:
                retDict[i]["desc"] = desc
                updated = True
        index += 1
    return [retDict, updated]


def swap_elements(retDict, a, b):
    retDict[a]["index"], retDict[b]["index"] = retDict[b]["index"], retDict[a]["index"]
    retDict[a], retDict[b] = retDict[b], retDict[a]


def delete_element(someDict, a = None):
    retDict = {}
    count = len(someDict)-1
    index = 0
    if a == count:
        for i in range(count):
            retDict[i] = someDict[i]
    if a < count:
        for i in range(0,a):
            retDict[index] = someDict[i]
            index += 1
        for i in range(a+1,count+1):
            retDict[index] = someDict[i]
            index += 1
    return retDict

# Run the bot
bot.run(TOKEN)