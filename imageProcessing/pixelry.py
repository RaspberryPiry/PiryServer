import cv2
import sys
import numpy as np

MAX_WIDTH = 32
MAX_HEIGHT = 32

def wh_ratio(width, height):
    return width / MAX_WIDTH, height / MAX_HEIGHT

def get_aver_pixel(img, x, y):
    (height, width, _) = img.shape
    h_window = int(height / MAX_WIDTH)
    w_window = int(width / MAX_HEIGHT)
    before_h = h_window * y
    after_h = h_window * (y + 1)
    before_w = w_window * x 
    after_w = w_window * (x + 1)

    add_r = 0
    add_g = 0
    add_b = 0
    # Opencv open image BGR default.
    for h in range(before_h, after_h + 1):
        for w in range(before_w, after_w + 1):
            add_r += img[h][w][2]
            add_g += img[h][w][1]
            add_b += img[h][w][0]
    blue = check_bound(int(add_b / (w_window * h_window)))
    green = check_bound(int(add_g / (w_window * h_window)))
    red = check_bound(int(add_r / (w_window * h_window)))

    return [blue, green, red]

def check_bound(color):
    if color < 0:
        return 0
    elif color > 255:
        return 255
    else:
        return color

def get_middle_pixel(img, x, y):
    (height, width, _) = img.shape
    h_window = int(height / MAX_WIDTH)
    w_window = int(width / MAX_HEIGHT)
    before_h = h_window * y
    after_h = h_window * (y + 1)
    before_w = w_window * x 
    after_w = w_window * (x + 1)

    return img[int((before_h + after_h) / 2)][int((before_w + after_w) / 2)]

def pixelize(img, pixel_func="middle"):
    dst = np.zeros((MAX_HEIGHT, MAX_WIDTH, 3), dtype=np.uint8)
    
    for y in range(MAX_HEIGHT):
        for x in range(MAX_WIDTH):
            if pixel_func == "middle":
                dst[y][x] = get_middle_pixel(img, x, y)
            elif pixel_func == "aver":
                dst[y][x] = get_aver_pixel(img, x, y)
            else:
                dst[y][x] = get_middle_pixel(img, x, y)
    
    return dst

def paint_shower(img, pixel_func="middle"):
    dst = np.zeros((MAX_HEIGHT * 2, MAX_WIDTH * 2, 3), dtype=np.uint8)

    for y in range(MAX_HEIGHT):
        for x in range(MAX_WIDTH):
            if pixel_func == "middle":
                dst[y * 2][x * 2] = get_middle_pixel(img, x, y)
            elif pixel_func == "aver":
                dst[y * 2][x * 2] = get_aver_pixel(img, x, y)
            else:
                dst[y * 2][x * 2] = get_middle_pixel(img, x, y)
    
    return dst

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage : ~.py ${IMG_INPUT} ${OUTPUT_FILE}")
        exit()
    
    img = cv2.imread(sys.argv[1])

    cv2.imwrite(sys.argv[2], paint_shower(img, pixel_func="middle"))