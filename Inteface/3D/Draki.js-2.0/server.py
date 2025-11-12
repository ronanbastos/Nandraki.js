import os
import webbrowser
import threading

# Função para abrir o navegador após um pequeno atraso
def abrir_navegador():
    import time
    time.sleep(1)  # Aguarda o servidor iniciar
    webbrowser.open("http://localhost:8000")

# Inicia a thread para abrir o navegador
threading.Thread(target=abrir_navegador).start()

# Inicia o servidor HTTP no terminal atual
os.system("python -m http.server 8000")
