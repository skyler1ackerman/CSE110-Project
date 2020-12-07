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

@bot.command(name='new', help='Adds a new task to the list')
async def newTask(ctx, name, *taskName):
	allTask[name] = " ".join(taskName)
	await ctx.send("Added task " + name)

@bot.command(name='delete', help='Deletes a task from the list')
async def newTask(ctx, name):
	del allTask[name]
	await ctx.send("Deleted task " + name)

@bot.command(name='list', help='Lists all tasks')
async def listTasks(ctx):
	if allTask:
		await ctx.send("These are the current tasks")
		for item in allTask:
			await ctx.send(item + ": " + allTask[item])
	else:
		await ctx.send("There are no current tasks")

@bot.command(name='story',help='Records all stories.')
async def recordStory(ctx, name, *story):
	allStory[name] = " ".join(story)
	await ctx.send("Added story " + name)


@bot.command(name='checkoff')
async def checkoffTask(ctx, taskName):
	allTask[taskName]+=":Finished!"
	msg = await ctx.send("Checked off task "+ taskName)
	await msg.add_reaction("✅")


@bot.command(name='shutdown',help='Shuts down the script')
async def shutdown(ctx):
	await ctx.send('See ya nerds')
	await ctx.bot.logout()
	taskStore.dumpTasks(allTask)
	storyStore.dumpStories(allStory)

allTask = taskStore.loadTasks()
allStory = storyStore.loadStories()
bot.run(TOKEN)
