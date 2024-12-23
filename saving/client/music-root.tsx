import { fail, isNull } from '../shared/core';
import { MusicApp } from './music-app';
import { willRerenderOver } from './reacting';

function run() {
    const rootElement = document.getElementById('root');
    if (isNull(rootElement)) return fail('No root element.');
    const willRender = willRerenderOver(MusicApp, rootElement);
    willRender({});
    return;
}
run();
