import discord
import os
import userStore

from dotenv import load_dotenv
from discord.ext import commands

userStories = []
TOKEN = os.environ['DISCORD_TOKEN']
GUILD= 'CSE110 Bot Testing'

bot = commands.Bot(command_prefix='!')
client = discord.Client()
me = discord.ClientUser

@bot.event
async def on_ready():
	print(f'{bot.user.name} has connected to Discord!')
	userStories = userStore.loadStories()

@bot.command(name='show')
async def showCtx(ctx):
	for x in userStories:
		await ctx.send(x)
	

@bot.command(name='id')
async def getId(ctx, parseWord):
	messages = await ctx.channel.history(limit=200).flatten()
	dmChannel = await ctx.author.create_dm()
	tempList = []
	for x in messages:
		if parseWord in x.content and not x.author.bot:
			print(x.content)
			userStories.append(x.content)

	
@bot.command(name='s',help='Shuts down the script')
async def shutdown(ctx):
	await ctx.send('See ya nerds')
	await ctx.bot.logout()
	userStore.dumpStories(userStories)

bot.run(TOKEN)