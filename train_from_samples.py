


from keras.callbacks import ModelCheckpoint

from gpu import reset_gpu
from loading_images import load_samples_as_list
from making_ae_paris import image_shape, make_autoencoder_paris
from making_dataset import make_dataset
from settings import Settings

# https://stackoverflow.com/questions/58088560/high-loss-from-convolutional-autoencoder-keras

def run_training_from_samples(args: Settings):

    reset_gpu()
    # https://aws.amazon.com/what-is/overfitting
    # needs at least 50 000 samples better 100 000


    coders = make_autoencoder_paris()

    samples = load_samples_as_list(args)


    split_at = None if args.train_val_spit_at is None else int(args.train_val_spit_at * len(samples))
    train_samples = samples if split_at is None else samples[:split_at]
    val_samples = samples if split_at is None else samples[split_at:]

    print(f"batch size: {args.batch}")
    print(f"epochs: {args.epochs}")
    print(f"train/val split at {args.train_val_spit_at}")
    print(f"train length: {len(train_samples)}, test length: {len(val_samples)}")

    checkpoint_callback = ModelCheckpoint(
        filepath=args.weights_path,
        save_weights_only=True,
        save_freq='epoch',
        monitor='val_loss',
        period=1,
    )

    train_dataset = make_dataset(args, train_samples, image_shape)
    val_dataset = make_dataset(args, val_samples, image_shape)

    coders.autoencoder.fit(
        train_dataset,
        epochs=args.epochs,
        batch_size=args.batch,
        shuffle=True,
        validation_data=val_dataset,
        callbacks=[checkpoint_callback],
    )


