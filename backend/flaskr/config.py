import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', os.path.abspath('ingebot_key.json'))
