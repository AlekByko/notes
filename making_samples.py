import numpy as np
from PIL import Image

from gpu import reset_gpu
from loading_images import load_samples_as_list
from making_ae_new_york import make_autoencoder
from making_dataset import make_dataset
from settings import Settings

sample_shape = (120, 160, 1)
sample_size = sample_shape[:2]
latent_dim = 1024
filter_size = 16

def run_making_samples(args: Settings):

    reset_gpu()

    coders = make_autoencoder(sample_shape, latent_dim, filter_size)
    samples = load_samples_as_list(args)

    coders.autoencoder.load_weights(args.weights_path)


    white = (255, 255, 255)
    sample_height, sample_width = sample_size
    cols = 4
    length = len(samples)
    image_width = cols * sample_width
    extra_row_maybe = 1 if length % cols > 0 else 0
    image_height = (int(length / cols) + extra_row_maybe) * sample_height
    image_size = (image_width, image_height)
    print(f"Image size: {image_size}")

    image = Image.new('RGB', image_size, white)

    dataset = make_dataset(args, samples, sample_shape)
    latents = coders.encoder.predict(dataset)
    decodeds = coders.decoder.predict(latents)

    for i in range(length):
        floats = decodeds[i]
        bytes = (floats * 255).astype(np.uint8)
        bytes = bytes.reshape(sample_size)
        restored = Image.fromarray(bytes, 'L')
        col = i % cols
        row = int((i - col) / cols)
        x = col * sample_width
        y = row * sample_height
        pos = (x, y)
        image.paste(restored, pos)

    image.save('w:/results/test.png')


