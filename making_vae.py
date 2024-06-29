import tensorflow as tf
from keras import layers, models
from keras.backend import exp, random_normal, shape

from coders import Coders


def make_vae(image_shape, latent_dim, filter_size) -> Coders:

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

    mean = layers.Dense(latent_dim)(x)
    log_var = layers.Dense(latent_dim)(x)

    def sampling(args):
        mean, log_var = args
        epsilon = random_normal(shape=(shape(mean)[0], latent_dim), mean=0., stddev=1.)
        return mean + exp(log_var / 2) * epsilon

    z = layers.Lambda(sampling)([mean, log_var])

    encoder = models.Model(input_image, [mean, log_var, z], name="encoder")
    encoder.summary()


    decoder_input = layers.Input(shape=(latent_dim,))
    flattened_dim = tf.reduce_prod(shape_before_flattening)
    x = layers.Dense(flattened_dim, activation="relu")(decoder_input)
    x = layers.Reshape(shape_before_flattening)(x)
    x = layers.Conv2DTranspose(filter_size, (3, 3), activation="relu", padding="same")(x)
    x = layers.UpSampling2D((2, 2))(x)
    x = layers.Conv2DTranspose(filter_size * 2, (3, 3), activation="relu", padding="same")(x)
    x = layers.UpSampling2D((2, 2))(x)
    x = layers.Conv2DTranspose(filter_size * 2 * 2, (3, 3), activation="relu", padding="same")(x)
    x = layers.UpSampling2D((2, 2))(x)
    decoded = layers.Conv2D(1, (3, 3), activation="sigmoid", padding="same")(x)


    decoder = models.Model(decoder_input, decoded, name="decoder")
    decoder.summary()


    vae_input = layers.Input(shape=image_shape)
    vae_mean, vae_log_var, vae_z = encoder(vae_input)
    vae_output = decoder(vae_z)

    # Define the VAE model
    vae = models.Model(vae_input, vae_output, name='vae')

    # VAE loss function
    reconstruction_loss = tf.reduce_mean(tf.square(vae_input - vae_output))
    kl_loss = -0.5 * tf.reduce_mean(1 + vae_log_var - tf.square(vae_mean) - tf.exp(vae_log_var))
    vae_loss = reconstruction_loss + kl_loss

    vae.add_loss(vae_loss)
    vae.compile(optimizer='adam')
    vae.summary()

    return Coders(vae, encoder, decoder)
