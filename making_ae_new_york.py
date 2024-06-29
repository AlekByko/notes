import tensorflow as tf
from keras import layers, models

from coders import Coders

image_shape = (120, 160, 1)
latent_dim = 1024
filter_size = 16

def make_autoencoder_new_york() -> Coders:

    input_image = layers.Input(shape=image_shape, name="encoder_input")
    x = input_image

    x = layers.Conv2D(filter_size * 2 * 2, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D((2, 2), padding="same")(x)
    x = layers.Conv2D(filter_size * 2, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D((2, 2), padding="same")(x)
    x = layers.Conv2D(filter_size, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D((2, 2), padding="same")(x)

    shape_before_flattening = x.shape[1:]
    x = layers.Flatten()(x)

    encoded = layers.Dense(latent_dim, activation="relu")(x)

    encoder = models.Model(input_image, encoded, name="encoder")
    encoder.summary()

    flattened_dim = tf.reduce_prod(shape_before_flattening)
    x = layers.Dense(flattened_dim, activation="relu")(encoded)
    x = layers.Reshape(shape_before_flattening)(x)
    x = layers.Conv2DTranspose(filter_size, (3, 3), activation="relu", padding="same")(x)
    x = layers.UpSampling2D((2, 2))(x)
    x = layers.Conv2DTranspose(filter_size * 2, (3, 3), activation="relu", padding="same")(x)
    x = layers.UpSampling2D((2, 2))(x)
    x = layers.Conv2DTranspose(filter_size * 2 * 2, (3, 3), activation="relu", padding="same")(x)
    x = layers.UpSampling2D((2, 2))(x)
    decoded = layers.Conv2D(1, (3, 3), activation="sigmoid", padding="same")(x)

    decoder = models.Model(encoded, decoded, name="decoder")
    decoder.summary()

    autoencoder_input = layers.Input(shape=image_shape)
    encoded_img = encoder(autoencoder_input)
    decoded_img = decoder(encoded_img)
    autoencoder = models.Model(autoencoder_input, decoded_img, name="autoencoder")
    autoencoder.summary()

    autoencoder.compile(optimizer="adam", loss="mse")

    return Coders(autoencoder, encoder, decoder)
