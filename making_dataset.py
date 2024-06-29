import tensorflow as tf

from settings import Settings



def make_dataset(args: Settings, samples, image_shape):
    # https://github.com/tensorflow/tensorflow/issues/35264#issuecomment-1363177995


    def generator_samples():

        # ADD SHUFFLING HERE?

        for idx in range(len(samples)):
            sample = samples[idx]
            sample_tensor = tf.convert_to_tensor(sample, dtype=tf.float32)
            yield sample_tensor, sample_tensor

    dataset = tf.data.Dataset.from_generator(
        generator_samples,
        output_signature=(
            tf.TensorSpec(shape=image_shape, dtype=tf.float32),
            tf.TensorSpec(shape=image_shape, dtype=tf.float32)
        )
    )
    return dataset.batch(args.batch)
