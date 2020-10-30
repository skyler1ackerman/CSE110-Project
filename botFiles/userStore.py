import json
import jsonpickle

def dumpStories(taskList):
	with open('storyList/stories', 'w') as f:
		json.dump(taskList, f, indent=2)

def loadStories():
	with open('storyList/stories') as f:
		return json.load(f)