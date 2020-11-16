import requests
import json
from bs4 import BeautifulSoup

def getGroupInfo(soup):
    allGroups = soup.find_all(['h2','p'])
    groupDict = {}
    for group in allGroups:
        if group.has_attr('id'):
            groupDict[group.text] = {}
            groupDict[group.text]['Invite'] = allGroups[allGroups.index(group)+1].text.replace('\u00a0', '').replace('invite:','')
            groupDict[group.text]['Admin'] = allGroups[allGroups.index(group)+2].text.replace('\u00a0', '').replace('admin:','')
            groupDict[group.text]['Who'] = allGroups[allGroups.index(group)+3].text.replace('\u00a0', '').replace('members:','')
            groupDict[group.text]['Desc'] = allGroups[allGroups.index(group)+4].text.replace('\u00a0', '').replace('description:','')
    return groupDict

url = "https://docs.google.com/document/u/0/d/165Fw-mvlHDok0CsUqVgBhBFVx-YNPaLBMoMyYXgbVhk/mobilebasic#h.ge7mkmfhz48n"
response = requests.get(url)
soup = BeautifulSoup(response.content.decode('utf-8'), 'html.parser')

with open('groupInfo.json', 'w') as f:
    json.dump(getGroupInfo(soup),f,indent=2)