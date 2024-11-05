from flaskr import create_app

app = create_app()

if __name__ == '__main__':
    # Permite acceso desde otras IPs en la misma red local
    app.run(host='0.0.0.0', port=5000, debug=True)
