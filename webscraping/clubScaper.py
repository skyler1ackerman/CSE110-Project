import requests
import itertools
import json
from bs4 import BeautifulSoup
from collections import defaultdict
from urllib.parse import urljoin
# So it turns out the UCSD club website has an out of date SSL cert
# I had to run with verify=False to bypass
# These two lines get rid of the warning so it doesn't show several hundred times
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# The urls to the site with links to all of the club pages
URL = "https://studentorg.ucsd.edu/"
coursePage = requests.get(URL, verify=False)

# A function that goes to the base page and gets all of the links to the club pages
# Takes in the soup object for the OG link
def getLinks(soup):
	clubLinks = []
	# Each link is in a 'tr' element (Row on a table)
	for item in soup.find_all('tr'):
		# 'a' should define a hyperlink. We check that it does just in case
		for club in item.findChildren('a'):
			if club.has_attr('href'):
				# Add the partial link to the list
				clubLinks.append(club['href'])
	# Return a new list that gives a full URL by appending the partial URL to the full URL
	return [urljoin(URL,shortUrl) for shortUrl in clubLinks]

# Get specific club info from each page.
# Takes a list of full URLs
def getClubInfo(fullLinks):
	# Start with an empty dict
	clubInfo = {}
	# For each link, get the page
	for link in fullLinks:
		clubPage = requests.get(link,verify=False)
		clubSoup = BeautifulSoup(clubPage.content, 'html.parser')
		# The first (and only) h1 object should be the club name
		title = clubSoup.find('h1').text
		# The first h4 object should be the category. We remove "Category" from the text to get the pure data.
		cat   = (clubSoup.find('h4').text).replace('Category', '').strip()
		# Define a nested dictionary with a key equal to the club name
		clubInfo[title] = {'Category': cat}
		# The first (and only) dl object should be the club info
		mainTable = clubSoup.find('dl')
		# All of the dt objects contain the labels, and the dd objects contain the data
		# They are side by side in the hierarchy, so we need to make a list out of each and zip them
		for label, desc in zip(mainTable.find_all('dt'), mainTable.find_all('dd')):
			# Make sure they have text
			if label.text and desc.text:
				# We can't delete carriage returns from the purpose paragraph without it looking wierd
				# For everything else, we set each dictionary key to the label and the value to the data
				# We also strip off all leading and trailing spaces, and delete all new lines and carriage returns
				# There were so many. For no reason.
				if "Purpose" not in label.text:
					clubInfo[title][label.text.replace('\n','').replace('\r','').strip()] = desc.text.replace('\n','').replace('\r','').strip()
				else:
					clubInfo[title][label.text.replace('\n','').strip()] = desc.text.replace('\n','').strip()
	# Return the full dictionary of dictionaries
	return clubInfo

# Get the base soup
soup = BeautifulSoup(coursePage.content, 'html.parser')
# Get all of the links
clubLinks = getLinks(soup)
# Make a json file out of the nested dictionaries
with open('clubInfo.json', 'w') as f:
	json.dump(getClubInfo(clubLinks),f,indent=2)