import { readMarch, readOptions } from 'reading-templates';
import { dumpChockedAndContext } from '../shared/reading-basics';

// http://localhost:8081/sandbox.html?trying-reading-templates


var parsed = readOptions('{test| another test|and we done}', 0, 0);
console.log(parsed);
var parsed = readOptions('{test}', 0, 0);
console.log(parsed);
var parsed = readOptions('{}', 0, 0);
console.log(parsed);

var text = `{abc|de fg|$hijk {lmn|$qrs|{tuv|wx|yz}}}`;
var march = readMarch(text, 0, 0, false, (_index, _tokens, choked) => choked);
if (march.isBad) {
    dumpChockedAndContext(march, text);
}
console.log(march);
