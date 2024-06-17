import glob
import os
import shutil

from PIL import Image, UnidentifiedImageError

from settings import Settings


def run_image_sorter(args: Settings):
    pathes = glob.glob(args.samples_dir + "*")
    for path in pathes:
        if os.path.isdir(path):
            continue

        try:
            image = Image.open(path)
            x, y = image.size
            dir_name = f"{x}x{y}"
            image.close()
            maybe_move_file(args.samples_dir, dir_name, path)
            print(f"Moved: {dir_name}: {path}")

        except UnidentifiedImageError:
            dir_name = "bad"
            maybe_move_file(args.samples_dir, dir_name, path)
            print(f"Moved {dir_name}: {path}")
            pass


def maybe_move_file(samples_dir: str, dir_name: str, path: str):
    dir_path = os.path.join(samples_dir, dir_name)
    file_name = os.path.basename(path)
    file_path = os.path.join(dir_path, file_name)
    if os.path.exists(file_path):
        return
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    shutil.move(path, dir_path)
