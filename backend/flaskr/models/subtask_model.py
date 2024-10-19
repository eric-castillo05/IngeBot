class Subtask:
    def __init__(self, subtask_id: str, title: str):
        self.subtask_id = subtask_id
        self.title = title

    def to_dict(self):
        return {
            'subtask_id': self.subtask_id,
            'title': self.title
        }