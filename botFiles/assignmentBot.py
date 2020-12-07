import discord
import pyrebase
import re
import asyncio
from config import fireConfig
from discord.ext import commands
from datetime import datetime
from collections import OrderedDict

firebase = pyrebase.initialize_app(fireConfig)
db = firebase.database()
top = "Assignments"

def setup(bot):
    bot.add_cog(AssignmentBot(bot))

class AssignmentBot(commands.Cog):
	def __init__(self, bot):
		self.bot = bot

	#!addAssign "assignment name" mm/dd/yyyy
	@commands.command(name='addAssign', help='Adds a new assignment to the list')
	async def newEvent(self, ctx, name=None, *date):
		content = ctx.message.content
		#check for proper name format
		if name and (content.count('\"') == 2):
			title = content.split('"')[1].strip()
			#strip out mm/dd/yyyy format from following 
			dateFound = re.search('(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}' , content[content.rindex('"')+1:].strip())
			#check date format, if date at all, if empty quotes
			if dateFound and title:
				#check if assignment name already exists in db
				if db.child(ctx.guild.id).child(top).child(title).shallow().get().val():
					await ctx.send('Assignment "' + name + '" already exists!')
				else:
					db.child(ctx.guild.id).child(top).child(title).child('title').set(title)
					db.child(ctx.guild.id).child(top).child(title).child('date').set(''.join(str(dateFound.group())))
					if(len(db.child(ctx.guild.id).child(top).get().val()) == 1):
						self.bot.loop.create_task(self.checkSchedule(ctx.guild))
					await ctx.send('Added assignment "' + name + '"')
			else:
				await ctx.send('Please use the format: !addAssign "Assignment Name" mm/dd/yyyy')
		else:
			await ctx.send('Please use the format: !addAssign "Assignment Name" mm/dd/yyyy')

	#!delAssign "assignment name"
	@commands.command(name='delAssign', help='Deletes an assignment from the list')
	async def delEvent(self, ctx, name=None):
		content = ctx.message.content
		#check empty argument and in quotes
		if name and (content.count('\"') == 2):
			titleDel = content.split('"')[1].strip()
			#check empty quotes
			if titleDel:
				#check exists then removes from db
				if db.child(ctx.guild.id).child(top).child(titleDel).shallow().get().val():
					db.child(ctx.guild.id).child(top).child(titleDel).remove()
					await ctx.send('Removed assignment "' + titleDel + '"')
				else:
					await ctx.send('Assignment "' + name + '" does not exist')
			else:
				await ctx.send('Please use the format: !delAssign "Assignment Name"')
		else:
				await ctx.send('Please use the format: !delAssign "Assignment Name"')

	#!listAssign
	@commands.command(name='listAssign', help='Lists all assignments')
	async def listEvents(self, ctx):
		if db.child(ctx.guild.id).child(top).get().val():
			assignDict = dict(db.child(ctx.guild.id).child(top).get().val())
			assignDict = dict(sorted(assignDict.items(), key=lambda k_v: datetime.strptime(k_v[1]['date'], '%m/%d/%Y')))
			for assKey in assignDict:
				await ctx.send(assignDict[assKey]['title'] + ' due on ' + assignDict[assKey]['date'])
		else:
			await ctx.send('There are no assignments to list!')


	async def checkSchedule(self, guild):
		while(True):
			# sanity check
			if db.child(guild.id).child(top).get().val():
				assignDict = dict(db.child(guild.id).child(top).get().val())
				for assKey in assignDict:
					date = datetime.strptime(assignDict[assKey]['date'], '%m/%d/%Y')
					currDateTime = datetime.today()
					channel = discord.utils.get(guild.text_channels, name="general")
					if date.date() == currDateTime.date():
						if channel:
							await channel.send("@everyone, " + assignDict[assKey]['title'] + " is due today.")
					elif date.date() < currDateTime.date():
						if channel:
							await channel.send("@everyone, " + assignDict[assKey]['title'] + " was due.")
							db.child(guild.id).child(top).child(assKey).remove()
			await asyncio.sleep(10)