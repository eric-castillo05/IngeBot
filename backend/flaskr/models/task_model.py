from typing import List

class Priority:
    LOW: 'low'
    MEDIUM: 'medium'
    HIGH: 'high'


class iTask:
    def __init__(self, title: str, description: str,due_date:str, priority: Priority):

        self.title = title
        self.description = description
        self.priority = priority
        self.due_date = due_date

    def to_dict(self):
        return {

            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'due_date': self.due_date,
            'created_at': self.getCurrentTimestamp()

        }

    def getCurrentTimestamp(self):
        from datetime import datetime
        current_timestamp = datetime.now()
        formatted_timestamp = current_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return formatted_timestamp