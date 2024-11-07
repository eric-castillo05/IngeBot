from typing import List
from flaskr.models import Subtask
from flaskr.utils import DateFormater


class Priority:
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'

class Task:
    def __init__(self, title: str, description: str, priority: Priority, due_date: str):
        self.title = title
        self.description = description
        self.priority = priority
        self.due_date = DateFormater.dateFormat(due_date),
        self.progress = 0.0


    def to_dict(self):
        return {
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'due_date': self.due_date,


        }
