import { fail, isNull } from '../shared/core';
import { MusicAppOld } from './music-app-old';
import { willRerenderOver } from './reacting';

function run() {
    const rootElement = document.getElementById('root');
    if (isNull(rootElement)) return fail('No root element.');
    const willRender = willRerenderOver(MusicAppOld, rootElement);
    willRender({});
    return;
}
run();
