import discord
import pyrebase
import asyncio
from datetime import datetime
from config import fireConfig
from config import TOKEN
from discord.ext import commands, tasks

firebase = pyrebase.initialize_app(fireConfig)
auth = firebase.auth()
db = firebase.database()

##GUILD= 'CSE110 Bot Testing'

bot = commands.Bot(command_prefix='!')
client = discord.Client()

top = "Events"

@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')

@bot.command(name='eventhelp', aliases=['eventbot','events','eventbothelp'], caseinsensitive = True, help='')
async def help(ctx):
	await ctx.send("Placeholder help message, commands are setevent, deleteevent, schedule, shutdown")

@bot.command(name='setevent', aliases=['addevent','newevent','plan'], caseinsensitive = True, help='Adds a new event to the list')
async def newEvent(ctx, *eventName):
	def check(newMessage):
			return newMessage.author == ctx.author
	if len(eventName) == 0:
		await ctx.send('Enter name of the event to be planned.')
		eventName = await bot.wait_for("message", timeout=60, check=check)
		name = eventName.content
	else:
		name = ' '.join(eventName)

	if db.child(top).child(ctx.guild.id).child(name).shallow().get().val():
		await ctx.send('Event "' + name + '" already exists!')
	else:
		await ctx.send("Enter date of event, MM DD YYYY (spaces required).")
		eventDate = await bot.wait_for("message", timeout=60, check=check)
		await ctx.send("Enter time of event, HH MM (pm/am) (spaces required).")
		eventTime = await bot.wait_for("message", timeout=60, check=check)
		datetimeEvent = datetime.strptime(eventDate.content + " " + eventTime.content, '%m %d %Y %I %M %p')
		data = {"date" : datetimeEvent.isoformat(' ')}
		db.child(top).child(ctx.guild.id).child(name).set(data)
		await ctx.send('Added event "' + name + '", scheduled for ' + datetimeEvent.ctime() + '.')

@bot.command(name='deleteevent', aliases=['removeevent','cancelevent','unplan'], caseinsensitive = True, help='Deletes a task from the list')
async def delEvent(ctx, *eventName):
	def check(newMessage):
			return newMessage.author == ctx.author
	if len(eventName) == 0:
		await ctx.send('Enter name of the event to be removed.')
		eventName = await bot.wait_for("message", timeout=60, check=check)
		name = eventName.content
	else:
		name = ' '.join(eventName)

	if db.child(top).child(ctx.guild.id).child(name).shallow().get().val():
		db.child(top).child(ctx.guild.id).child(name).remove()
		await ctx.send('Removed event "' + name + '"')
	else:
		await ctx.send('Event "' + name + '" does not exist!')

@bot.command(name='schedule',aliases=['showevents','showschedule','showplan'], caseinsensitive = True, help='Lists all events')
async def listEvents(ctx):
	if db.child(top).child(ctx.guild.id).shallow().get():
		allEvents = db.child(top).child(ctx.guild.id).get().val()
		if allEvents is None:
			await ctx.send("There are no events to list!")
			return
		await ctx.send("All events scheduled in server '" + ctx.guild.name + "':")
		for eventKey in allEvents:
			for event in allEvents[eventKey]:
				await ctx.send(eventKey + " at " +allEvents[eventKey][event])
	else:
		await ctx.send("There are no events to list!")


@bot.command(name='shutdown', caseinsensitive = True, help='Shuts down the script')
async def shutdown(ctx):
	await ctx.send('Shutting down ' + bot.user.name + "!")
	await ctx.bot.logout()

async def check_time(self):
	while(True):
		print(self + 1)
		self = self + 1
		await asyncio.sleep(1)

dummy = 0
bot.loop.create_task(check_time(dummy))
bot.run(TOKEN)
print("Bot off")