import argparse


def read_settings():
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=str)
    parser.add_argument("--mode", type=str)
    parser.add_argument("--sample-size", type=int)
    args = parser.parse_args()
    settings = Settings(args)
    return settings


class Settings:
    def __init__(self, args):
        self.args = args

    @property
    def path(self) -> str:
        value = self.args.path
        if (value.find('.') > 0):
            raise Exception(f"Bad path: {value}")
        return value

    @property
    def config_path(self):
        return self.path + '.json'

    @property
    def image_path(self):
        return self.path + '.jpg'

    @property
    def weights_path(self):
        return self.path + '.hdf5'

    @property
    def mode(self) -> str:
        return self.args.mode

    @property
    def sample_size(self) -> int:
        return self.args.sample_size
