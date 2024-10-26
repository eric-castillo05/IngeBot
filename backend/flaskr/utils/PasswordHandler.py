import bcrypt

class PasswordHandler(str):
    @staticmethod
    def encrypt_password(raw_password: str) -> str:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    @staticmethod
    def verify_password(raw_password: str, encrypted_password: str) -> bool:
        return bcrypt.checkpw(raw_password.encode('utf-8'), encrypted_password.encode('utf-8'))
