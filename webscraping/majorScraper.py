import json
import requests
import re
from bs4 import BeautifulSoup

URL = "https://www.ucsd.edu/catalog/front/UndDegrees.html"
coursePage = requests.get(URL)
soup = BeautifulSoup(coursePage.content, 'html.parser')

# This line find all of the list elements on the page, eliminates the ones with links, and then writes it all to a json file.
# It also cleans up each entry by getting rid of newlines, tabs, excess spaces, and wierd dashes.
with open('Info/majors.json', 'w') as f:
	json.dump([re.sub(' +', ' ', major.text).replace('\n','').replace('\t','').replace('\u2014','-').replace('\u2013','-').strip() for major in soup.findAll('li') if not major.find('a')],f,indent=2)