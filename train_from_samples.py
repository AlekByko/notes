

from autoencoder_one_conv import make_coders
from gpu import reset_gpu
from loading import load_tiles_from_snaps
from settings import Settings
from training import train


def run_training_from_samples(args: Settings):

    reset_gpu()

    coders = make_coders(args.latent_dim)

    tiles = load_tiles_from_snaps(args.snaps)

    train(args, tiles, coders)

