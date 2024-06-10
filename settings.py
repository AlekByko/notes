import argparse


def read_settings():
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=str)
    parser.add_argument("--width", type=int)
    parser.add_argument("--height", type=int)
    parser.add_argument("--mode", type=str)
    args = parser.parse_args()
    settings = Settings(args)
    return settings


class Settings:
    def __init__(self, args):
        self.args = args

    @property
    def path(self):
        value = self.args.path
        if (value.find('.') > 0):
            raise Exception(f"Bad path: {value}")
        return value

    @property
    def width(self):
        return self.args.width

    @property
    def height(self):
        return self.args.height

    @property
    def mode(self) -> str:
        return self.args.mode
