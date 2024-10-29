from typing import List

class Priority:
    LOW: 'low'
    MEDIUM: 'medium'
    HIGH: 'high'

class Task:
    def __init__(self, uid: str, title: str, description: str, priority: Priority, subtasks: List = []):
        self.uid = uid
        self.title = title
        self.description = description
        self.priority = priority
        self.subtasks = subtasks

    def to_dict(self):
        return {
            'uid': self.uid,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'subtasks': [subtask.to_dict() for subtask in self.subtasks]
        }