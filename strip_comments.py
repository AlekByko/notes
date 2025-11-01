

def strip_slash_star_comments(text: str):

    at = 0
    while True:
        startAt = text.find("/*", at)
        if startAt < 0: break
        at = startAt + 2 # length of token

        endAt = text.find("*/", at)
        if endAt < 0: break
        endAt += 2 # length or token

        text = text[:startAt] + text[endAt:]
    return text

def strip_rest_line_comments(text: str, pattern: str):
    at = 0
    while True:
        startAt = text.find(pattern, at)
        if startAt < 0: return text
        at = startAt + len(pattern)

        endAt = text.find("\r\n", at)
        if endAt < 0:
            endAt = text.find("\n", at)
            if endAt < 0: return text[:startAt] # comment, but no line break

        at = endAt # <-- we want to preserve line ending chars so we don't skip them
        text = text[:startAt] + text[endAt:]



def test_slash_star():
    raw = """a b c/*
    fuck off
*/ d e
    """
    fixed = strip_slash_star_comments(raw)
    print(fixed)


def test_rest_line():
    text = """
    //
        hey // sis
        whatup // dog"""
    text = strip_rest_line_comments(text, '//')
    print(text)

if __name__ == '__main__':
    # test_slash_star()
    test_rest_line()
