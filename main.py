import socket
import json
import threading
import time
import webview

class Api:
    def __init__(self, backend_class):
        self.backend_class = backend_class
        self.backend = None

    def connect(self, ip, port):
        self.backend = self.backend_class(ip, int(port))
        self.backend.start()

        webview.windows[0].evaluate_js("document.getElementById('ip-modal').style.display = 'none';")

class WiiUInputBackend:
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.sock = None
        self.running = True
        self.thread_listen = threading.Thread(target=self.listen_wiiu, daemon=True)

    def start(self):
        self.thread_listen.start()

    def send_ping_loop(self):
        while self.running:
            try:
                if self.sock:
                    self.sock.sendall(b"ping")
            except Exception:
                break
            time.sleep(1 / 60)

    def listen_wiiu(self):
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.connect((self.ip, self.port))

            self.thread_ping = threading.Thread(target=self.send_ping_loop, daemon=True)
            self.thread_ping.start()

            while self.running:
                try:
                    length_str = ""
                    while True:
                        char = self.sock.recv(1).decode()
                        if char == "#":
                            break
                        length_str += char
                    if not length_str:
                        break

                    total_length = int(length_str)
                    data = self.sock.recv(total_length)
                    if not data:
                        break

                    decoded = data.decode()
                    json_data = json.loads(decoded)

                    webview.windows[0].evaluate_js(f"onInputData({json.dumps(json_data)})")

                except Exception:
                    break
        except Exception:
            pass

    def stop(self):
        self.running = False
        if self.sock:
            try:
                self.sock.shutdown(socket.SHUT_RDWR)
            except:
                pass
            try:
                self.sock.close()
            except:
                pass

if __name__ == "__main__":
    api = Api(WiiUInputBackend)
    webview.create_window(
    "Wii U Input Viewer",
    "ui/index.html",
    js_api=api,
    width=800,
    height=600,
    resizable=False,   # 🔒 empêche le redimensionnement
    fullscreen=False   # 🔒 empêche le plein écran au lancement
)

    webview.start()

