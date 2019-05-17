from time import sleep
import serial
import pyautogui

port = serial.Serial('/dev/cu.usbmodem14401', 9600)

counter = 32

print("Reading on port " + port.name)

while True:
    if port.readline() == b'JUMP\r\n':
        pyautogui.click(pyautogui.position())
    sleep(0.01)
