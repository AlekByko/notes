from face_sdk.modules.context import Context


def read_face_sdk_context(obj: Context):
    if obj.is_none():
        return None
    if obj.is_string():
        return obj.get_value()
    if obj.is_double():
        return obj.get_value()
    if obj.is_long():
        return obj.get_value()
    if obj.is_bool():
        return obj.get_value()
    if obj.is_unsigned_long():
        return obj.get_value()
    if obj.is_array():
        all = list()
        for val in obj:
            one = read_face_sdk_context(val)
            all.append(one)
        return all

    if obj.is_object():
        keys = obj.keys()
        all = {}
        for key in keys:
            all[key] = read_face_sdk_context(obj[key])
        return all
