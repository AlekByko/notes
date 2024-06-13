import tensorflow as tf
from keras import layers, models

input_shape = (180, 320, 3)
latent_dim = 32 # <-- the more features to capture the larger
dense_dim = 32 # <-- arbitrary more or less, the more data the larger

def make_encoder():
    encoder_input = layers.Input(shape=input_shape)
    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(encoder_input)
    x = layers.MaxPooling2D((2, 2), padding='same')(x)
    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D((3, 2), padding='same')(x)

    # CNN 128 should stay:
    x = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D((2, 2), padding='same')(x)

    x = layers.Flatten()(x)
    x = layers.Dense(dense_dim, activation='relu')(x)

    encoder = tf.keras.models.Model(encoder_input, x, name='encoder')

    # z_mean = layers.Dense(latent_dim, name='z_mean')(x)
    # z_log_var = layers.Dense(latent_dim, name='z_log_var')(x)
    # def sampling(args):
    #     z_mean, z_log_var = args
    #     batch = tf.shape(z_mean)[0]
    #     dim = tf.shape(z_mean)[1]
    #     epsilon = tf.keras.backend.random_normal(shape=(batch, dim))
    #     return z_mean + tf.exp(0.5 * z_log_var) * epsilon
    # z = layers.Lambda(sampling, output_shape=(latent_dim,), name='z')([z_mean, z_log_var])
    # encoder = models.Model(encoder_input, [z_mean, z_log_var, z], name='encoder')

    encoder.summary()
    return encoder

def make_decoder():
    decoder_input = layers.Input(shape=(latent_dim,), name='decoder_input')
    x = layers.Dense(15 * 40 * 128, activation='relu')(decoder_input)
    x = layers.Reshape((15, 40, 128))(x)

    # CNN 128 should stay:
    x = layers.Conv2DTranspose(128, (3, 3), activation='relu', padding='same')(x)
    x = layers.UpSampling2D((2, 2))(x)

    x = layers.Conv2DTranspose(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.UpSampling2D((3, 2))(x)
    x = layers.Conv2DTranspose(32, (3, 3), activation='relu', padding='same')(x)
    x = layers.UpSampling2D((2, 2))(x)

    decoder_output = layers.Conv2DTranspose(3, (3, 3), activation='sigmoid', padding='same')(x)
    decoder = models.Model(decoder_input, decoder_output, name='decoder')
    decoder.summary()
    return decoder

class VAE(tf.keras.Model):
    def __init__(self, encoder, decoder, **kwargs):
        super(VAE, self).__init__(**kwargs)
        self.encoder = encoder
        self.decoder = decoder

    def call(self, inputs):
        # z_mean, z_log_var, z = self.encoder(inputs)
        z = self.encoder(inputs)
        reconstructed = self.decoder(z)
        # kl_loss = -0.5 * tf.reduce_sum(z_log_var - tf.square(z_mean) - tf.exp(z_log_var) + 1)
        # # # kl_loss = tf.reduce_mean(kl_loss) * 0.1
        # self.add_loss(kl_loss)
        return reconstructed

def vae_loss(inputs, outputs):
    reconstruction_loss = tf.reduce_mean(tf.square(inputs - outputs))
    return reconstruction_loss

def make_vae():
    encoder = make_encoder()
    decoder = make_decoder()
    vae = VAE(encoder, decoder)

    vae.compile(optimizer='adam', loss=vae_loss)
    vae.built = True
    return vae, encoder, decoder
