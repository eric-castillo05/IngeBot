from ..utils import EncryptedPassword

class User:
    def __init__(self, name: str, first_lastname: str, second_lastname: str, c_number: str, email: str, password: str):
        self.name = name
        self.first_lastname = first_lastname
        self.second_lastname = second_lastname
        self.c_number = c_number
        self.email = email
        self.password = EncryptedPassword.encrypt_password(password)
