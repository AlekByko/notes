import { testMarch } from './validating-templates';

// http://localhost:8081/sandbox.html?trying-reading-templates

testMarch(
    `{}`,
    `[OP: ]`
);
testMarch(
    `{test}`,
    `[OP: "test"]`
);
testMarch(
    `{test| another test|and we done}`,
    `[OP: "test" | " another test" | "and we done"]`,
);
testMarch(
    `{a|b}{c|d}`,
    `[OP: "a" | "b"] [OP: "c" | "d"]`
);
testMarch(
    `{abc|de fg|$hijk {lmn|$qrs|{tuv|wx|yz}}}`,
    '[OP: "abc" | "de fg" | [ID: $hijk] " " [OP: "lmn" | [ID: $qrs] | [OP: "tuv" | "wx" | "yz"]]]'
);

testMarch(
    `$color = {red|green|blue}`,
    `[AS: $color = [OP: "red" | "green" | "blue"]]`
);

