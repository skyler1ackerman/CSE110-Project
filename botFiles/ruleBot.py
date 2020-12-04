import discord
import re
import pyrebase
from urllib import request
from discord.ext import commands
from config import firebaseConfig, DISCORD_TOKEN


""" DECLARATIONS """
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()
storage = firebase.storage()
discordClient = commands.Bot(command_prefix="!")


@discordClient.event
async def on_ready():
    print("Bot is online.")    


@discordClient.command(aliases = ['rules', 'Rule', 'Rules'])
async def rule(ctx, a = None):
    newDict = {}
    all_guilds = db.child("guilds").get().each()
    gid = ctx.guild.id
    guildExists = False

    # check if guilds exists, then check if guild exists in those guilds list
    # get guild rules if guild exists, else get default rules
    if all_guilds:
        for guild in all_guilds:
            if gid == int(guild.key()):
                newDict = rules_Dict(gid, None, None)[0]
                guildExists = True
    if not guildExists:
        newDict = default_Dict()

    count = len(newDict)
    # stringCount = 0

    # if no arguemnt, list all rules, else if check for bad input
    # if no bad input, jump to else section
    if a == None:
        # list every rule in a separate 
        for i in range(count):
            # if stringCount == 10:
            rulestr = ""
            rulestr = "" + str(i) + ". "+ newDict[i]["title"] + ": " + newDict[i]["desc"]
            await ctx.send(rulestr)
    elif not a.isnumeric():
        await ctx.send("Error: Not a positive number." + '\n' + "Please enter a non-negative number to view a specific rule, or no number to view all rules.")
    elif int(a) >= count:
        await ctx.send("Error: We do not have that many rules!")
    elif int(a) < 0:
        await ctx.send("Error: Must be a non-negative number.")
    else:
        x = int(a)
        print(type(str(x)))
        rulestr = "" + str(x) + ". "+ newDict[x]["title"] + ": " + newDict[x]["desc"]
        await ctx.send(rulestr)
        

@discordClient.command(aliases = ['deleteRule', 'deleterule'])
async def delete_rule(ctx, a = None):
    guildExists = False
    newDict = {}
    gid = ctx.guild.id
    all_guilds = db.child("guilds").get().each()

    if a == None:
        await ctx.send("Please enter a rule number to delete. If you do not know the number for a rule, enter !rules to see all the rules with their numbers.")
    elif not a.isnumeric():
        await ctx.send("Please enter a rule number to delete.")
    elif int(a) == 0:
        await ctx.send("Cannot delete rule 0: the welcome message.")
    else:
        if all_guilds:
            for guild in all_guilds:
                if gid == int(guild.key()):
                    newDict = delete_element(rules_Dict(gid)[0], int(a))
                    guildExists = True
                    if int(a) > len(newDict)-1:
                        await ctx.send("Invalid rule number.")
                        return
                    # db.child("guild").child(gid).remove()
                    db.child("guilds").child(gid).set(newDict)
                    await ctx.send("Rule deleted successfully.")
        if not guildExists:
            newDict = delete_element(default_Dict(), int(a))
            if int(a) > len(newDict)-1:
                await ctx.send("There are not that many rules")
                return
            db.child("guilds").child(gid).set(newDict)
            await ctx.send("Rule deleted successfully.")


@discordClient.command(aliases = ['swaprule', 'swapRule', 'swaprules', 'swapRules'])
async def swap_rule(ctx, a = None, b = None):
    guildExists = False
    newDict = {}
    gid = ctx.guild.id
    all_guilds = db.child("guilds").get().each()              
    
    if a == None or b == None:
        await ctx.send("Error: Please enter two rule numbers to swap.")
    elif not a.isnumeric():
        await ctx.send("Error: First value to swap is not numeric.")
    elif not b.isnumeric:
        await ctx.send("Error: Second value to swap is not numeric.")
    elif int(a) == 0 or int(b) == 0:
        await ctx.send("Error: Cannot swap rule 0: the welcome message")
    else:
        x,y = int(a), int(b)
        if all_guilds:
            for guild in all_guilds:
                if gid == int(guild.key()):
                    newDict = rules_Dict(gid)[0]
                    index = len(newDict) - 1
                    if x > index or y > index:
                        await ctx.send("Error: Number(s) too big. There are not that many rules.")
                        return
                    swap_elements(newDict, x, y)
                    db.child("guilds").child(gid).set(newDict)
                    await ctx.send("Rules swapped successfully")
                    guildExists = True
                    break               
        if not guildExists:
            newDict = default_Dict()
            swap_elements(newDict, x, y)
            db.child("guilds").child(gid).set(newDict)
            await ctx.send("Rules swapped successfully")


@discordClient.command(aliases = ['addRule', 'addrule'])
async def add_rule(ctx, *, args = None):
    newDict = {}
    guildExists = False
    gid = ctx.guild.id
    all_guilds = db.child("guilds").get().each()
    
    content = ctx.message.content
    newTitle = "**" + content.split('"')[1].strip() + "**"
    newDesc = content[content.rindex('"')+1:].strip()
    
    if not args:
        await ctx.send("Please enter a rule title and rule description with the format:\n!addrule \"title\" description")
    elif content.count('\"') != 2 or args[0] != '"':
        await ctx.send("Please enclose only the rule title in parentheses. There must be two parentheses in a command. The format to add a new rule is:\n!addrule \"title\" description")
    elif args[0] == '"' and args[1] == '"':
        await ctx.send("The rule must have a title. Please use the following format to add a new rule:\n!addrule \"title\" description")
    else:
        if all_guilds:
            for guild in all_guilds:
                if gid == int(guild.key()):
                    newDict = rules_Dict(gid, newTitle, newDesc)[0]
                    update = rules_Dict(gid, newTitle, newDesc)[1]
                    count = len(newDict)
                    if not update:
                        newDict[count] = {"index": count, "desc": newDesc, "title": newTitle}
                    db.child("guilds").child(gid).set(newDict)
                    guildExists = True
                    await ctx.send("Rule added successfully!")
                    break
        if not guildExists:
            newDict = default_Dict()
            count = len(newDict)
            newDict[count] = {"index": count, "desc": newDesc, "title": newTitle}
            db.child("guilds").child(gid).set(newDict)
            guildExists = True
            await ctx.send("Rule added successfully!")


def default_Dict():
    retDict = {}
    defRules = db.child("default").get().each()
    for i in range(len(defRules)):
        retDict[i] = {"index": defRules[i].val()["index"], "desc": defRules[i].val()["desc"], "title": defRules[i].val()["title"]}
    return retDict


def rules_Dict(guildNum, title = None, desc = None):
    index = 0
    retDict = {}
    updated = False
    guildRules = db.child("guilds").child(guildNum).get().each()

    for i in range(len(guildRules)):
        if not guildRules[i].val() == None:
            retDict[index] = {"index": guildRules[i].val()["index"], "desc": guildRules[i].val()["desc"], "title": guildRules[i].val()["title"]}
            if retDict[i]["title"] == title:
                retDict[i]["desc"] = desc
                updated = True
        index += 1
    return [retDict, updated]


def swap_elements(retDict, a, b):
    retDict[a]["index"], retDict[b]["index"] = retDict[b]["index"], retDict[a]["index"]
    retDict[a], retDict[b] = retDict[b], retDict[a]


def delete_element(someDict, a = None):
    retDict = {}
    count = len(someDict)-1
    index = 0
    if a == count:
        for i in range(count):
            retDict[i] = someDict[i]
    if a < count:
        for i in range(0,a):
            retDict[index] = someDict[i]
            index += 1
        for i in range(a+1,count+1):
            retDict[index] = someDict[i]
            index += 1
    return retDict


discordClient.run("c4ODg3NjkyMDExMTc1OTM2.X7YhsA.9mw4oL88gEaoN1Wnq9ZkBa1_XGI")
