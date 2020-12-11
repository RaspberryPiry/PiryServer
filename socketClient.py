import socket
import time
import subprocess

HOST = "127.0.0.1"
PORT = 36001
DC_RUN = ['node', 'client.js']
WC_RUN = ['node', 'client.js']

def recv_data(client_socket):
    data = client_socket.recv(4)
    length = int.from_bytes(data, 'little')

    data = client_socket.recv(length)
    return data.decode()

if __name__ == "__main__":
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((HOST, PORT))

    while True:
        before_msg = "NC"
        msg = recv_data(client_socket)
        if msg == before_msg:
            time.sleep(1)
        else:
            if msg == "DC":
                subprocess.run(['node', 'client.js'])
            before_msg = msg
            print(msg)
