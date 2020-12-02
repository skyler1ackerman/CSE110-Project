import discord
import os
import pyrebase
import re
import asyncio
from config import fireConfig
from config import token1
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
TOKEN = token1
GUILD= 'CSE110 Bot Testing'

bot = commands.Bot(command_prefix='!')
client = discord.Client()

top = "Assignments"

@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')


@bot.command(name='addAssign', help='Adds a new assignment to the list')
async def newEvent(ctx, name=None, *date):
	content = ctx.message.content
	if name is not None and (content.count('\"') == 2):
		print('past')
		title = content.split('"')[1].strip()
		date1 = content[content.rindex('"')+1:].strip()
		dateFound = re.search('(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}' , date1)
		print(title)
		if dateFound and title:
			if db.child(ctx.channel.id).child(top).child(name).shallow().get().val():
				await ctx.send('Assignment "' + name + ' already exists!')
			else:
				db.child(ctx.channel.id).child(top).child(name).set(''.join(str(dateFound.group())))
				await ctx.send('Added assignment "' + name + '"')
		else:
			await ctx.send('Please use the format: !addAssign "Assignment Name" mm/dd/yyyy')
	else:
		await ctx.send('Please use the format: !addAssign "Assignment Name" mm/dd/yyyy')

@bot.command(name='delAssign', help='Deletes an assignment from the list')
async def delEvent(ctx, name):
	if db.child(ctx.channel.id).child(top).child(name).shallow().get().val():
		db.child(ctx.channel.id).child(top).child(name).remove()
		await ctx.send('Removed assignment "' + name + '"')
	else:
		await ctx.send('Assignment "' + name + '" does not exist')

@bot.command(name='listAssign', help='Lists all assignments')
async def listEvents(ctx):
	if db.child(ctx.channel.id).child(top).shallow().get():
		newDate = {}
		assignArray = []
		allAssign = db.child(ctx.channel.id).child(top).get().val()
		for channelID in db.get().val():
			if int(channelID) == ctx.channel.id:
				for assignment in db.get().val()[channelID]['Assignments']:
					newDate[assignment] = db.get().val()[channelID]['Assignments'][assignment]
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
			for channelID in db.get().val():
				for assignment in db.get().val()[channelID]['Assignments']:
					date = datetime.strptime(db.get().val()[channelID]['Assignments'][assignment], '%m/%d/%Y')
					currDateTime = datetime.today()
					if date.date() == currDateTime.date():
						channel = bot.get_channel(int(channelID))
						if channel:
							await channel.send("@everyone, " + assignment + " is due today.")
					elif date.date() < currDateTime.date():
						channel = bot.get_channel(int(channelID))
						if channel:
							await channel.send("@everyone, " + assignment + " was due.")
							db.child(channelID).child(top).child(assignment).remove()

#		# keep loop asleep for 8 hours
		await asyncio.sleep(28800)
## main, note that checkSchedule() will run before bot start-up and old events will be deleted with no message 
bot.loop.create_task(checkSchedule())

bot.run(TOKEN)
