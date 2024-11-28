import os

import cv2
import numpy as np
from face_sdk import Service
from fastapi import FastAPI
from PIL import Image
from pydantic import BaseModel

from core import fail
from face_skd_utils import read_face_sdk_context

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}


class Tile(BaseModel):
    imageFilePath: str
    x: int
    y: int
    width: int
    height: int


def read_sdk_path():
    open_face_sdk_path_param = "OPEN_FACE_SDK_PATH"
    path = os.getenv(open_face_sdk_path_param, None)
    if path is None:
        return fail(f"No {open_face_sdk_path_param} in ENV.")
    elif not os.path.exists(path):
        return fail(
            f"Open Face SDK path {path} via {open_face_sdk_path_param} does not exist."
        )
    else:
        return path


def make_sure_path_exist(path):
    if not os.path.exists(path):
        fail(f"Path {path} does not exist.")


@app.post("/face-mesh")
async def tile_face(tile: Tile):
    image_path = tile.imageFilePath
    make_sure_path_exist(image_path)

    sdk_path = read_sdk_path()
    service = Service.create_service(sdk_path)
    face_detector = service.create_processing_block({"unit_type": "FACE_DETECTOR"})
    mesh_fitter = service.create_processing_block({"unit_type": "FITTER"})

    image = cv2.imread(tile.imageFilePath)  # , cv2.IMREAD_COLOR)
    print("ok image")

    whole_image: np.ndarray = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    print("ok whole image")

    tile_image = crop_cv_image(whole_image, tile.x, tile.y, tile.width, tile.height)
    print("ok tile image")

    imgCtx = {
        "dtype": "uint8_t",
        "format": "NDARRAY",
        "blob": tile_image.tobytes(),
        "shape": [dim for dim in tile_image.shape],
    }

    context = service.create_context({"image": imgCtx})

    face_detector(context)
    mesh_fitter(context)

    all_objects = read_face_sdk_context(context)

    result = {"tile": tile, "objects": all_objects}
    return result




def pil_to_opencv(pil_image: Image.Image):
    opencv_image = np.array(pil_image)
    opencv_image = cv2.cvtColor(opencv_image, cv2.COLOR_RGB2BGR)
    return opencv_image


def opencv_to_pil(opencv_image):
    opencv_image = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(opencv_image)
    return pil_image


def crop_cv_image(cv_image, x_start, y_start, width, height):
    cropped_cv_image = cv_image[
        y_start : y_start + height, x_start : x_start + width, :
    ]
    return cropped_cv_image
