import requests
from bs4 import BeautifulSoup
from collections import defaultdict

URL = "https://ucsd.edu/catalog/front/courses.html"
coursePage = requests.get(URL)


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


# This is just a way to see all of the attributes of a variable
# Try running it on "soup"
def printAttributes(var):
	for x in dir(var):
		print(x)


#
soup = BeautifulSoup(coursePage.content, 'html.parser')

allCourse = getCourseLinks(soup)

# This is just to show the lists
for key, linkList in allCourse.items():
	print(key, linkList)

# TODO: How to navigate through the given links
# TODO: How to pull the class info on each page