import requests
from bs4 import BeautifulSoup

URL = "https://ucsd.edu/catalog/front/courses.html"
coursePage = requests.get(URL)

soup = BeautifulSoup(coursePage.content, 'html.parser')

print(soup.prettify())