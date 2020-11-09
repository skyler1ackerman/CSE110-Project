import discord
import pyrebase
from urllib import request
from discord.ext import commands
from config import firebaseConfig, DISCORD_TOKEN

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()
storage = firebase.storage()

# IF YOU EVER EDIT THE FILE, MAKE SURE TO UPDATE THE URL BELOW
# because every time the file is edited, access token is regenerated!!
RULES_FILE_URL = "https://firebasestorage.googleapis.com/v0/b/discord-rule-bot.appspot.com/o/rules.txt?alt=media&token=62e272e5-2a91-492f-ba2e-0c79e84da524"

# receives an object of type HTTPSResponse
resp = request.urlopen(RULES_FILE_URL)

# use the object to read data from it in byte form
data = resp.read()
# decode the raw data into digestible format (str)
rulewall = data.decode("UTF-8")
# split at every newline and make a list
rule_List = rulewall.split('\n')

discordClient = commands.Bot(command_prefix="!")

""" ruleFile = open('rules.txt', 'r')
    # readlines() reads every line and returns a list
rules = ruleFile.readlines()
    # 10 rules: 10th rule = index 10; -1 is needed 
"""

ruleCount = len(rule_List)-1


@discordClient.event
async def on_ready():
    print("Bot is online.")

@discordClient.command(aliases = ['rules'])
    # It is possible to set default arguments
async def rule(ctx, number=-1):
    if number == 34:
        await ctx.send("We got a person of culture right here! ( ͡° ͜ʖ ͡°)")

    elif number == -1:
        await ctx.send(rulewall)
            # char limit for sending text = 2000
            # the line below combines the rules list into a single string
        # ruleWall = '\n'.join((line) for line in rules)

    elif number > ruleCount:
        await ctx.send("We dont have that many rules!")

    else:
        await ctx.send(rule_List[int(number)])

discordClient.run(DISCORD_TOKEN)