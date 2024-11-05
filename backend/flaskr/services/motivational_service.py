import requests

class MotivationalService:
    def __init__(self):
        pass

    def get_phrase(self):
        url = 'https://frasedeldia.azurewebsites.net/api/phrase'
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return response.text
            else:
                return 'Error al obtener la frase'
        except requests.RequestException as e:
            return f'Ocurrió un error: {e}'