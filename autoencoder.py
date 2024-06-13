import tensorflow as tf


def make_coders():

    by2x2 = (2, 2)
    by3x2 = (3, 2)
    by3x3 = (3, 3)
    latent_dim = 64 # used to be 64 with 3 covn layers, now just 2

    # Define the encoder
    encoder_input = tf.keras.layers.Input(shape=(180, 320, 3), name='encoder_input')

    x = tf.keras.layers.Conv2D(32, by3x3, activation='relu', padding='same')(encoder_input)
    x = tf.keras.layers.MaxPooling2D(by2x2, padding='same')(x)

    x = tf.keras.layers.Conv2D(64, by3x3, activation='relu', padding='same')(x)
    x = tf.keras.layers.MaxPooling2D(by3x2, padding='same')(x) # <---- 3x2

    # CNN 128 should stay:
    x = tf.keras.layers.Conv2D(128, by3x3, activation='relu', padding='same')(x)
    x = tf.keras.layers.MaxPooling2D(by2x2, padding='same')(x)

    x = tf.keras.layers.Flatten()(x)
    encoder_output = tf.keras.layers.Dense(latent_dim, name='encoder_output')(x)

    encoder = tf.keras.models.Model(encoder_input, encoder_output, name='encoder')
    encoder.summary()

    # Define the decoder
    decoder_input = tf.keras.layers.Input(shape=(latent_dim,), name='decoder_input')
    x = tf.keras.layers.Dense(15 * 40 * 128, activation='relu')(decoder_input)
    x = tf.keras.layers.Reshape((15, 40, 128))(x)

    # CNN 128 should stay:
    x = tf.keras.layers.Conv2DTranspose(128, by3x3, activation='relu', padding='same')(x)
    x = tf.keras.layers.UpSampling2D(by2x2)(x)

    x = tf.keras.layers.Conv2DTranspose(64, by3x3, activation='relu', padding='same')(x)
    x = tf.keras.layers.UpSampling2D(by3x2)(x) # <---- 3x2

    x = tf.keras.layers.Conv2DTranspose(32, by3x3, activation='relu', padding='same')(x)
    x = tf.keras.layers.UpSampling2D(by2x2)(x)

    decoder_output = tf.keras.layers.Conv2DTranspose(3, by3x3, activation='sigmoid', padding='same')(x)
    decoder = tf.keras.models.Model(decoder_input, decoder_output, name='decoder')

    autoencoder = tf.keras.models.Model(encoder_input, decoder(encoder_output), name='autoencoder')

    autoencoder.compile(optimizer='adam', loss='mse')

    return Coders(autoencoder, encoder, decoder)

class Coders:
    def __init__(self,
                 autoencoder: tf.keras.models.Model,
                 encoder:  tf.keras.models.Model,
                 decoder:  tf.keras.models.Model
                 ):
        self.autoencoder = autoencoder
        self.encoder = encoder
        self.decoder = decoder

def dump_coder_summaries(coders: Coders):
    coders.encoder.summary()
    coders.decoder.summary()
