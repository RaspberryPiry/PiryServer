import cv2
import sys
import numpy as np
import imageio

MAX_WIDTH = 32
MAX_HEIGHT = 32

MOVIE_LIST = ["gif", "mp4"]

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
            try:
                add_r += img[h][w][2]
                add_g += img[h][w][1]
                add_b += img[h][w][0]
            except:
                pass
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
    
def get_top_pixel(img, x, y):
    (height, width, _) = img.shape
    h_window = int(height / MAX_WIDTH)
    w_window = int(width / MAX_HEIGHT)
    before_h = h_window * y
    before_w = w_window * x 

    return img[int(before_h)][int(before_w)]

def get_end_pixel(img, x, y):
    (height, width, _) = img.shape
    h_window = int(height / MAX_WIDTH)
    w_window = int(width / MAX_HEIGHT)
    after_h = h_window * (y + 1)
    after_w = w_window * (x + 1)

    return img[int(after_h - 1)][int(after_w - 1)]

def get_4_point_average_pixel(img, x, y):
    (height, width, _) = img.shape
    h_window = int(height / MAX_WIDTH)
    w_window = int(width / MAX_HEIGHT)
    before_h = h_window * y
    after_h = h_window * (y + 1)
    before_w = w_window * x 
    after_w = w_window * (x + 1)
    
    lt_point = img[before_h][before_w]
    rt_point = img[before_h][after_w - 1]
    lb_point = img[after_h - 1][before_w]
    rb_point = img[after_h - 1][after_w - 1]

    ret_point = [0, 0, 0]
    for c in range(0, 3):
        temp = lt_point[c] + rt_point[c] + lb_point[c] + rb_point[c]
        ret_point[c] = check_bound(int(temp / 4))
    return np.array(ret_point)

def pixelize_movie_printer(mov, pixel_func="middle"):
    ret, frame = mov.read()
    while ret:
        # Print do not convert RGB to BGR
        pixelize_printer(frame, pixel_func=pixel_func)
        ret, frame = mov.read()

def pixelize_movie_shower(mov, pixel_func="middle"):
    # gif, mp4 모두 다 가능한 함수.
    ret, frame = mov.read()
    pixel_images = []
    while ret:
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pixel_images.append(pixelize_shower(frame, pixel_func=pixel_func))
        ret, frame = mov.read()
    
    return pixel_images

def pixelize_movie(mov, pixel_func="middle"):
    # gif, mp4 모두 다 가능한 함수.
    ret, frame = mov.read()
    pixel_images = []
    while ret:
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pixel_images.append(pixelize(frame, pixel_func=pixel_func))
        ret, frame = mov.read()

    return pixel_images

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

def pixelize_printer(img, pixel_func="middle"):
    for y in range(MAX_HEIGHT):
        for x in range(MAX_WIDTH):
            if pixel_func == "middle":
                ret = get_middle_pixel(img, x, y)
            elif pixel_func == "aver":
                ret = get_aver_pixel(img, x, y)
            else:
                ret = get_middle_pixel(img, x, y)
            r = formatter(format(ret[2], 'x'))
            g = formatter(format(ret[1], 'x'))
            b = formatter(format(ret[0], 'x'))
            print(r + g + b, end=" ")
        print()
    print()

def formatter(rgb):
    return rgb if len(rgb) != 1 else "0" + rgb

def pixelize_shower(img, pixel_func="middle"):
    # 검은색 점을 하나씩 끼워넣어준 코드
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
    if len(sys.argv) != 2:
        print("Usage : ~.py ${IMG_INPUT}")
        exit()

    if sys.argv[1].split(".")[-1] in MOVIE_LIST:
        output_file = sys.argv[1].split(".")[0] + "_pixel_.gif"
        img = cv2.VideoCapture(sys.argv[1])
        pixelize_movie_printer(img, pixel_func='aver')
        # pixel_images = pixelize_movie_shower(img, pixel_func='aver')
        # imageio.mimsave(output_file, pixel_images)
    else:
        img = cv2.imread(sys.argv[1])
        # pixelize(img)
        pixelize_printer(img)
        # cv2.imwrite(sys.argv[2], paint_shower(img, pixel_func="middle"))