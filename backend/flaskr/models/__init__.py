from google.cloud import firestore
from typing import List
from ..utils import EncryptedPassword

db = firestore.Client()

class User:
    def __init__(self, name: str, first_lastname: str, second_lastname: str, c_number: str, email: str, password: str):
        self.name = name
        self.first_lastname = first_lastname
        self.second_lastname = second_lastname
        self.c_number = c_number
        self.email = email
        self.password = EncryptedPassword.encrypt_password(password)


class Priority:
    LOW: 'low'
    MEDIUM: 'medium'
    HIGH: 'high'


class Task:
    def __init__(self, task_id: str, title: str, description: str, priority: Priority, subtasks: List = []):
        self.task_id = task_id
        self.title = title
        self.description = description
        self.priority = priority
        self.subtasks = subtasks

    def to_dict(self):
        return {
            'task_id': self.task_id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'subtasks': [subtask.to_dict() for subtask in self.subtasks]
        }


class Subtask:
    def __init__(self, subtask_id: str, title: str):
        self.subtask_id = subtask_id
        self.title = title

    def to_dict(self):
        return {
            'subtask_id': self.subtask_id,
            'title': self.title
        }