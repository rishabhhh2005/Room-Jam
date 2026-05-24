import random
import string


def generate_room_key(length=6):
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=length))