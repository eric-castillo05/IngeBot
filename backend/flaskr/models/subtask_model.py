class Subtask:
    def __init__(self, title: str, description: str):
        self.title = title
        self.description = description

    def to_dict(self):
        return {
            'title': self.title,
            'description': self.description
        }