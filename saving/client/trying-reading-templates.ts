import { readOptions } from './reading-templates';
import { testMarch } from './validating-templates';

// http://localhost:8081/sandbox.html?trying-reading-templates


var parsed = readOptions('{test| another test|and we done}', 0, 0);
console.log(parsed);
var parsed = readOptions('{test}', 0, 0);
console.log(parsed);
var parsed = readOptions('{}', 0, 0);
console.log(parsed);

testMarch(
    `{abc|de fg|$hijk {lmn|$qrs|{tuv|wx|yz}}}`,
    '[OP: "abc" | "de fg" | [ID: $hijk] " " [OP: "lmn" | [ID: $qrs] | [OP: "tuv" | "wx" | "yz"]]]'
);

