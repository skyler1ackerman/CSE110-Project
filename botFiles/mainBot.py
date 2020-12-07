import discord
#import asyncio
# import datetime
# # You can replace this with your own token in the config file
from config import TG_TOKEN as TOKEN
from discord.ext import commands

intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents)

extensions = ['reportBot', 'eventBot', 'assignmentBot', 'ruleBot']
for exten in extensions:
	bot.load_extension(exten)

@bot.event
async def on_ready():
	print("TG Bot is online.")

# Regular shut down of the bot
@bot.command(name='s')
async def shutdown(ctx):
	await ctx.send('Shutting down TG Bot')
	await ctx.bot.logout()

bot.run(TOKEN)