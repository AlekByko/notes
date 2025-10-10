function run() {
    const args = process.argv.slice(2);
    if (args.length < 1) return console.log(`Need node version.`);
    const [nodePath] = args;
    const delim = ';'
    const older = process.env.Path.split(delim);
    let newer = older;
    newer = newer.filter(x => !x.includes('nodejs'));
    newer.push(nodePath);
    // console.log({ older, newer });
    const output = newer.join(delim);
    console.log(output);
}
run();