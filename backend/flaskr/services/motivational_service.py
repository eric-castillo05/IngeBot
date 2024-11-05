import requests

class MotivationalService:
    def __init__(self):
        pass

    def get_phrase(self):
        url = 'http://localhost:5000/motivational-message'
        try:
            response = requests.get(url)
            if response.status_code == 200:
                # Parsear el JSON y obtener el mensaje
                data = response.json()
                return data.get("message", "Mensaje no disponible")
            else:
                return 'Error al obtener la frase'
        except requests.RequestException as e:
            return f'Ocurrió un error: {e}'
