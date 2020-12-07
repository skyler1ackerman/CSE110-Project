from canvasapi import Canvas, course, assignment
import canvasapi
import datetime as dt
from datetime import datetime
from twilio.rest import Client
import os
import time



def main():
	token = os.environ['CANVAS_TOKEN']
	url = 'https://ucsd.instructure.com/api/v1/users/self'

	# token = os.getenv('CANVAS_TOKEN')
	# url = os.getenv('CANVAS_URL')
	DATE_CHECK_INTERVAL_SEC = 3

	tracker = AssTracker(url, token, dt.timedelta(seconds=10))
	while True:
		if tracker.should_update():
			print('updating...')
			tracker.update()

		for assign in tracker.assignments:
			diff = getDueDate(assign) - datetime.now()
			print(assign.id, 'due in', diff.days, 'days')
			if diff.days == 2:
				print(assign.name, ' is due my guy', '!'*20)
				send_message(assign.name + ' is due in ' + (str)(diff))
				tracker.remove(assign)

		time.sleep(DATE_CHECK_INTERVAL_SEC)

	# Useful commands:
	# canvas.get_courses(); Gets list of all courses for the user
	# course.get_assignments(); Gets a list of all get_assignment
	# assignment.due_at; Gets due date of assignment


class AssTracker:
	def __init__(self, url, token, update_period = dt.timedelta(days=1)):
		self.canvas = Canvas(url, token)
		self.update_period = update_period

		self.assignments = []
		self._assignment_set = set()
		self.last_updated = None # resets when update is called

		# setup
		self.update()

	def should_update(self):
		diff = datetime.now() - self.last_updated
		return diff >= self.update_period

	def update(self):
		for i, assign in enumerate(self.assignments):
			if isPast(getDueDate(assign)):
				del self.assignments[i]
				del self._assignment_set[assign.id]

		for assign in self._get_assignments():
			if not self._seen(assign) and not isPast(getDueDate(assign)):
				self.assignments.append(assign)
				self._assignment_set.add(assign.id)

		self._sort()
		self.last_updated = datetime.now()

	def remove(self, assign: assignment.Assignment):
		'''
		Takes the assignment out of the tracking list.

		Does not take the assignment id out if the set!

		return True on success and False on error
		'''
		try:
			self.assignments.remove(assign)
			return True
		except ValueError:
			return False

	def _seen(self, assign: assignment.Assignment):
		return assign.id in self._assignment_set

	def _sort(self):
		self.assignments.sort(key=lambda date: datetime.strptime(date.due_at, "%Y-%m-%dT%H:%M:%SZ"))

	def _get_assignments(self):
		for course in self.canvas.get_courses():
			if course.end_at is not None and isPast(course.end_at_date.replace(tzinfo=None)):
				continue
			yield from course.get_assignments()


def getClassMates(canvas: Canvas):
	temp = []
	for course in canvas.get_courses():
		for user in course.get_users():
			temp.append(user)
	return temp

def getAssignments(canvas: Canvas):
	temp = []
	for course in canvas.get_courses():
		for assign in course.get_assignments():
			temp.append(assign)
	return temp

def getDueDate(assignment):
	if assignment.due_at is not None:
		return datetime.strptime(assignment.due_at, "%Y-%m-%dT%H:%M:%SZ")
	else:
		return datetime(1,1,1)

def getDate(dateStr):
	if dateStr:
		return datetime.strptime(dateStr, "%Y-%m-%dT%H:%M:%SZ")

def isPast(datetimeObj):
	if(datetimeObj<datetime.now()):
		return True
	return False

def sortListByDate(assList):
	assList.sort(key=lambda date: datetime.strptime(date.due_at, "%Y-%m-%dT%H:%M:%SZ"))
	return assList


def send_message(message):
	account_sid = "AC6fd8ad98a091f7f743b8806561981df5"
	auth_token = "9141a3145a01567f2a84df0a4ff07198"
	client = Client(account_sid, auth_token)

	call = client.messages.create(
 	   to="+19258764016",
 	   from_="19253930247",
 	   body=message
	)


if __name__ == '__main__':
	try:
		main()
	except KeyboardInterrupt: # for clean stops locally
		print('\nexiting...')
		exit(0)





