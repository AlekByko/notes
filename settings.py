import argparse


def read_settings():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', type=str, required=True)
    parser.add_argument('--width', type=int, required=True)
    parser.add_argument('--height', type=int, required=True)
    args = parser.parse_args()
    settings = Settings()
    settings.path = args.path
    settings.width = args.width
    settings.height = args.height
    return settings

class Settings:
    def __init__(self):
        self.path = None
        self.width = None
        self.height = None
