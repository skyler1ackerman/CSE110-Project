import discord
import asyncio
import datetime
from discord.ext import commands

def setup(bot):
    bot.add_cog(ReportBot(bot))

class ReportBot(commands.Cog):
	def __init__(self, bot):
		self.bot = bot

	# This function gets called when the admin approves deleting a reported message
	async def delMsg(self, susMsg, reportMsg, reportMsgList):
		# We do a try except loop to avoid the edge case where another mod already deleted the given message
		try:
			# Tell the admin that we received the command to delete, then delete the message
			await reportMsg.channel.send('Deleting message "' + susMsg.content + '"')
			await susMsg.delete()
		# If someone already manually deleted the message we would hit an error. This is just to avoid that.
		except discord.errors.NotFound:
			await reportMsg.channel.send('That message has already been deleted!')
		# Send a message to every admin besides the one that deleted the message letting them know it got deleted.
		for channel in [msg.channel for msg in reportMsgList if msg.channel.recipient != reportMsg.channel.recipient]:
			await channel.send(str(reportMsg.channel.recipient) + ' deleted message "' + susMsg.content + '"')

	# This function gets called when the admin rejects deleting a reported message
	async def keepMsg(self, susMsg, reportMsg, reportMsgList):
		# We do a try except loop to avoid the edge case where another mod already deleted the given message
		try:
			# Tell the admin that we received the command to allow the message
			await reportMsg.channel.send('Ignoring message "' + susMsg.content + '"')
		# If someone already manually deleted the message we would hit an error. This is just to avoid that.
		except discord.errors.NotFound:
			await reportMsg.channel.send('That message has already been deleted!')
		# Send a message to every admin besides the one that allowed the message letting them know it was ignored.
		for channel in [msg.channel for msg in reportMsgList if msg.channel.recipient != reportMsg.channel.recipient]:
			await channel.send(str(reportMsg.channel.recipient) + ' ignored message "' + susMsg.content + '"')

	# This function is called after the report is sent to the admin
	# It waits for the admin to react with a check or x
	async def waitGen(self, reportMsgList, susMsg):
		# The admin can react with a check to delete the message, or an x to keep the message
		optionDict = {'✅':self.delMsg,'❌':self.keepMsg}
		# Checks that the admin reacted with one of the two options
		def check(react, user_):
			# We check that A. They reacted with one of the two emojis
			# B. The reaction was on the correct report message
			# C. There are two reactions (The bot's and the admins)
			return str(react.emoji) in optionDict.keys() and react.message.id in [msg.id for msg in reportMsgList] and react.count == 2
		# The bot will wait for the admin to react to the report message until the timeout
		# The timeout can be removed if we want it to wait forever, but I advise against that
		try:
			reportReact, reportAdmin = await self.bot.wait_for('reaction_add', timeout=60, check=check)
		# If the wait times out, simply continue
		except asyncio.TimeoutError:
			pass
		# If the wait returns true, then run the function corresponding to the given emoji
		else:
			await optionDict[reportReact.emoji](susMsg, reportReact.message, reportMsgList)

	# This function is called when a user 'flags' a message, AKA reacts with a red square
	async def sendReport(self, reaction, user):
		# The flagged message
		susMsg = reaction.message
		# Immediately remove the flag so that not everyone on the server can see who flagged
		await reaction.remove(user)
		# Get a list of all of the admins in the guild
		adminsList = [admin for admin in susMsg.guild.members if admin.guild_permissions.administrator and not admin.bot]
		# Loop through all the admins
		reportMsgList = []
		for admin in adminsList:
			# Send a report to the admin including who reported who, the message, the time, and instructions
			try:
				# If there isn't already a dm_channel between the bot and the user, create one
				if not admin.dm_channel:
					await admin.create_dm()
				reportMsg = await admin.dm_channel.send(user.name + ' reported ' + susMsg.author.name + 
				' for the following message:\n"' + susMsg.content + '"\nSent ' + 
				(susMsg.created_at + datetime.timedelta(hours=4)).strftime("%A, %B %d at %H:%M") +
				'\nPlease react with a ✅ to delete the reported message, or a ❌ to do nothing')
				# Prepopulate the message with the two options. This makes it easier for the admin to remove/keep a message
				await reportMsg.add_reaction('✅')
				await reportMsg.add_reaction('❌')
				# Make a list of all of the messages that went out to admins
				reportMsgList.append(reportMsg)
			except (discord.errors.Forbidden,discord.errors.HTTPException):
				print('Skipping user', admin.name)
				pass
			# Wait for the admin report 
		await self.waitGen(reportMsgList, susMsg)


	# Runs whenever a new reaction is added
	@commands.Cog.listener()
	async def on_reaction_add(self, reaction, user):
		# This is a dictionary of all of the emojis that the bot checks for.
		# Right now it's just the red flag
		optionDict = {'🟥': self.sendReport}
		# If the emoji sent is in the dict.keys(), it will run that function
		try:
			await optionDict[reaction.emoji](reaction, user)
		# Otherwise, it will ignore it
		except KeyError:
			pass