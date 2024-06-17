import tensorflow as tf



class Coders:
    def __init__(self,
                 autoencoder: tf.keras.models.Model,
                 encoder:  tf.keras.models.Model,
                 decoder:  tf.keras.models.Model
                 ):
        self.autoencoder = autoencoder
        self.encoder = encoder
        self.decoder = decoder
