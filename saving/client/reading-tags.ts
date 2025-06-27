import { isNonNull, isNull } from '../shared/core';

export function readTagsInQueryString(text: string) {
    const regex = /[&?]tags=([\w\-_]+(,[\w\-_]+)+)/ig;
    const match = regex.exec(text);
    if (isNull(match)) return null;
    const [_full, textList] = match;
    return _readTagsInList(textList);
}

/** UNSAFE: no check that comma is a separator */
function _readTagsInList(text: string) {
    const reg = /[\w\-_]+/g;
    const tags: string[] = [];
    for (let match = reg.exec(text); isNonNull(match); match = reg.exec(text)) {
        const [tag] = match;
        tags.push(tag);
    }
    return tags;
}

if (window.sandbox === 'reading-tags') {
    const tags = readTagsInQueryString('fhsdkjfhskj?tags=test,hey,what-up,_no_comments');
    console.log(tags);
}



