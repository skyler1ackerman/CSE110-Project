import discord
import os
import pyrebase
from config import fireConfig
from dotenv import load_dotenv
from discord.ext import commands, tasks
from datetime import datetime
import asyncio

def make_datetime(lst):
    date_str = lst[1]
    return datetime.strptime(date_str, '%m/%d/%Y')

firebase = pyrebase.initialize_app(fireConfig)
auth = firebase.auth()
db = firebase.database()

load_dotenv()
TOKEN = "Nzc0MDM3NDQ1OTQzMDk5NDAy.X6R8jA.R9mAid5oTdyxvcPgSQ8xwiKTjKM"
GUILD= 'CSE110 Bot Testing'

bot = commands.Bot(command_prefix='!')
client = discord.Client()

top = "Events"

@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')


@bot.command(name='addAssign', help='Adds a new assignment to the list')
async def newEvent(ctx, name, *date):
	if db.child(top).child(name).shallow().get().val():
		await ctx.send('Assignment "' + name + ' already exists!')
	else:
		data = {name: ''.join(date)}
		db.child(top).child(name).set(data)
		await ctx.send('Added assignment "' + name + '"')

@bot.command(name='delAssign', help='Deletes an assignment from the list')
async def delEvent(ctx, name):
	if db.child(top).child(name).shallow().get().val():
		db.child(top).child(name).remove()
		await ctx.send('Removed assignment "' + name + '"')
	else:
		await ctx.send('Assignment "' + name + '" does not exist')

@bot.command(name='listAssign', help='Lists all assignments')
async def listEvents(ctx):
	if db.child(top).shallow().get():
		newDate = {}
		eventArray = []
		allEvents = db.child(top).get().val()
		for eventKey in allEvents:
			for event in allEvents[eventKey]:
				newDate[event] = allEvents[eventKey][event]
		newData = list(newDate.items())
		sortedData = sorted(newData, key=make_datetime)
		for x, y in sortedData:
			await ctx.send(y+': '+x)
		print(sortedData)
	else:
		await ctx.send("There are no assignments to list!")


@bot.command(name='s',help='Shuts down the script')
async def shutdown(ctx):
	await ctx.send('Shutting down AssignmentBot')
	await ctx.bot.logout()

#async def check_time():
#	allEvents = db.child(top).get().val()
#	while(True):
#		today = datetime.today()
#		for eventKey in allEvents:
#			for event in allEvents[eventKey]:
#				if today.strftime('%m/%d/%Y') == datetime.strptime(allEvents[eventKey][event], '%m/%d/%Y'):
#					await ctx.send('@everyone "' + event + ' due today!')
#					db.child(top).child(event).remove()
#	await asyncio.sleep(1)
#bot.loop.create_task(check_time())

bot.run(TOKEN)
