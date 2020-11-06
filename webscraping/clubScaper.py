import requests
from bs4 import BeautifulSoup
from collections import defaultdict

# The urls to the site with links to all of the course pages
URL = "https://studentorg.ucsd.edu/"
coursePage = requests.get(URL, verify=False)

# This is just a way to see all of the attributes of a variable
# Try running it on "soup"
def printAttributes(var):
	for x in dir(var):
		print(x)

def getClubs(soup):
	clubNames = []
	for item in soup.find_all('tr'):
		for club in item.findChildren('a'):
			clubNames.append(club.text)
	return clubNames

# Get the base soup
soup = BeautifulSoup(coursePage.content, 'html.parser')

clubNames = getClubs(soup)
f = open('clubNames.txt', 'a')	
for club in clubNames:
	f.write(club+'\n')
f.close()