

import numpy as np


from autoencoder_one_conv import make_coders
from gpu import reset_gpu
from loading import load_samples_as_list
from settings import Settings
from training import train


def run_training_from_samples(args: Settings):

    reset_gpu()

    coders = make_coders(args.latent_dim)

    samples = load_samples_as_list(args)

    samples = np.array(samples)

    train(args, samples, coders)

