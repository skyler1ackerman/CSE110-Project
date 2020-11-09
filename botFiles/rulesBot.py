import discord
import pyrebase
from urllib import request
from discord.ext import commands
from config import firebaseConfig, DISCORD_TOKEN

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()
storage = firebase.storage()

# IF YOU EVER EDIT THE FILES, MAKE SURE TO UPDATE THE URLs BELOW
# because every time the fileS are edited, access tokens are regenerated!!
RULES_DESC_FILE = "https://firebasestorage.googleapis.com/v0/b/discord-rule-bot.appspot.com/o/ruleDesc.txt?alt=media&token=c58fc774-4692-4fb0-9de9-824b74d79747"
RULES_TITLES_FILE = "https://firebasestorage.googleapis.com/v0/b/discord-rule-bot.appspot.com/o/ruleTitles.txt?alt=media&token=e3a9a50c-7d77-45ee-bcc4-7a1cb53fdd53"

# receives an object of type HTTPSResponse
response_ruleDesc = request.urlopen(RULES_DESC_FILE)
response_ruleTitles = request.urlopen(RULES_TITLES_FILE)
# use the object to read data from it in byte form
ruleDescData = response_ruleDesc.read()
ruleTitlesData = response_ruleTitles.read()
# decode the raw data into digestible format (str)
ruleTitlesDecoded = ruleTitlesData.decode("UTF-8")
ruleDescDecoded = ruleDescData.decode("UTF-8")
# split at every newline and make a list
ruleTitles_list = ruleTitlesDecoded.split('\n')
ruleDesc_list = ruleDescDecoded.split('\n')

discordClient = commands.Bot(command_prefix="!")

""" ruleFile = open('rules.txt', 'r')
    # readlines() reads every line and returns a list
rules = ruleFile.readlines()
    # 10 rules: 10th rule = index 10; -1 is needed 
"""

ruleCount = len(ruleTitles_list)
ruleWall = ""
for x in range (ruleCount):
    ruleWall += str(x) + '. ' + ruleTitles_list[x] + ' ' + ruleDesc_list[x] + '\n'

@discordClient.event
async def on_ready():
    print("Bot is online.")

@discordClient.command(aliases = ['rules'], help='List a specific rule or list all rules')
    # It is possible to set default arguments
async def rule(ctx, number=None):
    if number is None:
        await ctx.send(ruleWall)

    else: 
        if number.isnumeric():
            if int(number) == 34:
                await ctx.send("We got a person of culture right here! ( ͡° ͜ʖ ͡°)")
            elif int(number) >= 0 and int(number) <= ruleCount:
                await ctx.send(str(number) + '. ' + ruleTitles_list[int(number)] + '\n' + ruleDesc_list[int(number)])
            else:
                await ctx.send("We dont have that many rules!")
        else:
            await ctx.send("Please write a valid number for a specific rule, or no number for all rules")

# @discordClient.command()
# async def help():
#     await ctx.send("Rules bot commands:'\n'!rule(s):        list all rules'\n'!rule(s) <number>:    list a single rule")

discordClient.run(DISCORD_TOKEN)
