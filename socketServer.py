import socket
import threading
import os
import sys
import time

PORT = 36001
CLIENT_SOCKET_LIST = []
ADDR_LIST = []
WEATEHR_LAST_TIME = ""
WEATHER_FILE = "upload/weather.json"
DATA_LAST_TIME = ""
DATA_FILE = "upload/composite.json"

def send_to_all(msg):
    global CLIENT_SOCKET_LIST
    i = 0
    client_max = len(CLIENT_SOCKET_LIST)
    while i < client_max:
        try:
            send_str_data(CLIENT_SOCKET_LIST[i], msg)
            i += 1
        except:
            print("Client Deleted.")
            del CLIENT_SOCKET_LIST[i]
            client_max -= 1

def recv_str_data(client_socket):
    data = client_socket.recv(4)
    length = int.from_bytes(data, "little")
    data = client_socket.recv(length)
    return data.decode()

def send_str_data(client_socket, msg):
    data = msg.encode()
    length = len(data)
    client_socket.sendall(length.to_bytes(4, byteorder="little"))
    client_socket.sendall(data)

def client_data_sender():
    global DATA_LAST_TIME
    global WEATEHR_LAST_TIME

    while True:
        if is_weather_changed():
            print("Weather Changed!")
            send_to_all("WC")
            WEATEHR_LAST_TIME = get_last_modified_time(WEATHER_FILE)
        elif is_data_changed():
            print("Data Changed!")
            send_to_all("DC")
            DATA_LAST_TIME = get_last_modified_time(DATA_FILE)
        else:
            print("Nothing Changed!")
            send_to_all("NC")
        time.sleep(1)    # 1초간 delay
        
def get_last_modified_time(path):
    return os.path.getmtime(path)

def is_weather_changed():
    return abs(WEATEHR_LAST_TIME - get_last_modified_time(WEATHER_FILE)) > sys.float_info.epsilon

def is_data_changed():
    return abs(DATA_LAST_TIME - get_last_modified_time(DATA_FILE)) > sys.float_info.epsilon

if __name__ == "__main__":
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind(('', PORT))
    server_socket.listen()

    DATA_LAST_TIME = get_last_modified_time(DATA_FILE)
    WEATEHR_LAST_TIME = get_last_modified_time(WEATHER_FILE)

    addr_list = []
    # Add Client Data Sender
    th = threading.Thread(target=client_data_sender)
    th.start()
    
    while True:
        client_socket, addr = server_socket.accept()
        CLIENT_SOCKET_LIST.append(client_socket)
        ADDR_LIST.append(addr)
        print("Client Added ", len(CLIENT_SOCKET_LIST))
    
