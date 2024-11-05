class Subtask:
    def __init__(self, title: str, description: str):
        self.title = title
        self.description = description
        self.status = 0

    def to_dict(self):
        return {
            'title': self.title,
            'description': self.description
        }