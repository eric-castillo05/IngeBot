class User:
    def __init__(self, first_name: str, middle_name: str, last_name: str, control_number: str, email: str,
                 password: str, image_path: str or None):
        self.first_name = first_name
        self.middle_name = middle_name
        self.last_name = last_name
        self.control_number = control_number
        self.email = email
        self.password = password
        self.image_path = image_path
