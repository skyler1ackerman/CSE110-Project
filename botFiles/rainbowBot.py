import discord
from discord.ext import commands

def setup(bot):
    bot.add_cog(RainbowBot(bot))


class RainbowBot(commands.Cog):
	def __init__(self, bot):
		self.bot = bot

	@commands.command(name="rainbow")
	async def rainbow(self, ctx):
		reactList = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪']
		for reaction in reactList:
			await ctx.message.add_reaction(reaction)