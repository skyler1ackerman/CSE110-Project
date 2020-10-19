import os
import taskStore

import discord
import random
from dotenv import load_dotenv
from discord.ext import commands
from dateutil.parser import parse

load_dotenv()
TOKEN = os.environ['DISCORD_TOKEN']
GUILD= 'CSE110 Bot Testing'

allTask = {}
# bot.p
# load_dotenv()
# TOKEN = os.getenv('DISCORD_TOKEN')

# 2
bot = commands.Bot(command_prefix='!')
client = discord.Client()
me = discord.ClientUser

@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')

@bot.command(name='newtask', help='Adds a new task to the list')
async def newTask(ctx, name, *taskName):
	allTask[name] = " ".join(taskName)
	await ctx.send(allTask[name])

@bot.command(name='deltask', help='Deletes a task from the list')
async def newTask(ctx, name):
	del allTask[name]
	await ctx.send("Deleted task " + name)

@bot.command(name='listtask', help='Lists all tasks')
async def listTasks(ctx):
	if allTask:
		await ctx.send("These are the current tasks")
		for item in allTask:
			await ctx.send(item + ": " + allTask[item])
	else:
		await ctx.send("There are no current tasks")


@bot.command(name='shutdown',help='Shuts down the script')
async def shutdown(ctx):
	await ctx.send('See ya nerds')
	await ctx.bot.logout()
	taskStore.dumpTasks(allTask)

allTask = taskStore.loadTasks()
bot.run(TOKEN)
