from datetime import datetime

class CurrentTimestamp:
    @staticmethod
    def get_current_timestamp():
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')