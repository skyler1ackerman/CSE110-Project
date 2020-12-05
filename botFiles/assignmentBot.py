import discord
import os
import pyrebase
import re
import asyncio
from config import DISCORD_TOKEN as TOKEN
from config import fireConfig
from dotenv import load_dotenv
from discord.ext import commands, tasks
from datetime import datetime

#used skylers skeleton
def make_datetime(lst):
    date_str = lst[1]
    return datetime.strptime(date_str, '%m/%d/%Y')

firebase = pyrebase.initialize_app(fireConfig)
auth = firebase.auth()
db = firebase.database()

load_dotenv()
GUILD= 'CSE110 Bot Testing'

bot = commands.Bot(command_prefix='!')
client = discord.Client()

top = "Assignments"

@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')

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


@bot.command(name='s',help='Shuts down the script')
async def shutdown(ctx):
	await ctx.send('Shutting down AssignmentBot')
	await ctx.bot.logout()

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

bot.run(TOKEN)
