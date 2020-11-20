import discord
import os
import pyrebase
from config import fireConfig
from dotenv import load_dotenv
from discord.ext import commands

firebase = pyrebase.initialize_app(fireConfig)
db = firebase.database()

load_dotenv()
TOKEN = os.environ['DISCORD_TOKEN']
GUILD= 'CSE110 Bot Testing'

bot = commands.Bot(command_prefix='!')
client = discord.Client()
top = "Tasks"

@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')

@bot.command(name='new', help='Adds a new task to the list')
async def newTask(ctx, name, *taskName):
	if db.child(top).child(name).shallow().get().val():
		await ctx.send('Task "' + name + ' already exists!')
	else:
		data = {name: " ".join(taskName)}
		db.child(top).child(name).set(data)
		await ctx.send('Added task "' + name + '"')

@bot.command(name='delete', help='Deletes a task from the list')
async def delTask(ctx, name):
	if db.child(top).child(name).shallow().get().val():
		db.child(top).child(name).remove()
		await ctx.send('Removed task "' + name + '"')
	else:
		await ctx.send('Task "' + name + '" does not exist')

@bot.command(name='list', help='Lists all tasks')
async def listTasks(ctx):
	if db.child(top).shallow().get():
		allTasks = db.child(top).get().val()
		for taskKey in allTasks:
			for task in allTasks[taskKey]:
				await ctx.send(task+": "+allTasks[taskKey][task])
	else:
		await ctx.send("There are no tasks to list!")


@bot.command(name='s',help='Shuts down the script')
async def shutdown(ctx):
	await ctx.send('Shutting down Taskbot')
	await ctx.bot.logout()

bot.run(TOKEN)
