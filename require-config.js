var require  = {
    baseUrl: './',
    paths: {
        'text': './node_modules/requirejs-plugins/lib/text',
        'json': './node_modules/requirejs-plugins/src/json',
        'react': './node_modules/react/umd/react.development',
        'react-dom': './node_modules/react-dom/umd/react-dom.development',
        '@tensorflow/tfjs': './node_modules/@tensorflow/tfjs/dist/tf.min',
    },
    shims: {
    },
    packages: [
	{ name: 'saving', location: './scripts/saving', main: 'configs' },
        { name: 'configs', location: './configs', main: 'configs' }
    ]
};
