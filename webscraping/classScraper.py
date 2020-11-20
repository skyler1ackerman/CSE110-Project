import requests
import json
import jsonpickle
from bs4 import BeautifulSoup
from collections import defaultdict
from urllib.parse import urljoin

# The urls to the site with links to all of the course pages
URL = "https://ucsd.edu/catalog/front/courses.html"
coursePage = requests.get(URL)

# This is just a way to see all of the attributes of a variable
# Try running it on "soup"
def printAttributes(var):
	for x in dir(var):
		print(x)


# This method gets all of the links to the other course pages 
def getCourseLinks(soup):
	# Make a default dict (Dict made of lists)
	courseList = defaultdict(list)
	# Go through all links
	for link in soup.find_all('a'):
		# If it actually is a link and has a title
		if link.has_attr('href') and link.has_attr('title'):
			# If the text containts "courses"
			# This makes sure that we only get the link to the page with the classes
			if "courses" in link.get_text():
				# Adds the link to the list in the dictionary
				courseList[link['title']].append(link['href'])
	# Returns a dict with format {Catagory : [link1, link2, ... linkN]}
	return courseList

# This is just to show the lists
def printLists(allCourse):
	for key, linkList in allCourse.items():
		print(key, linkList)

# This puts all of the urls into a format we can use with requests
def parseURLS(allCourse):
	for key, linkList in allCourse.items():
		for i, shortUrl in enumerate(linkList):
			linkList[i] = urljoin(URL,shortUrl)

# A method that gets all of the class names
def getClasses(allCourse):
	classNames = []
	# Go through all lists in dict
	for key, linkList in allCourse.items():
		# Go through all url in lists
		for shortUrl in linkList:
			# Get the major page
			coursePage = requests.get(shortUrl)
			# Get the soup from that page
			courseSoup = BeautifulSoup(coursePage.content, 'html.parser')
			# Get all the class names by the className "cource-name"
			for courseObj in courseSoup.find_all(class_="course-name"):
				# Get the text from the course-name object
				classText = courseObj.get_text()
				classText = classText.split()
				# Get text returns the full title of the class with units 
				# (Ex. ANTH 280B. Core Seminar in Cultural Anthropology (4))
				# To get just the className, get the first two words and edit out the period.
				classNames.append((' '.join(classText[0:2])).replace('.', ''))
	return classNames

# Get the base soup
soup = BeautifulSoup(coursePage.content, 'html.parser')
# Get all of the course urls from the base page
allCourse = getCourseLinks(soup)
# Get the full urls from the partial urls
parseURLS(allCourse)
# Get all the classes from all of the major pages
classNames = getClasses(allCourse)
# Print the names out to check that it worked

f = open('classNames.txt', 'a')	
for class_ in classNames:
	f.write(class_+'\n')

f.close()
# Total number of classes

