const config = {
    '*.js': ['eslint --fix --color'],
    '*.{json,yml,yaml}': ['prettier --write']
};

config['./openapi/*.json'] = ['speccy lint ./openapi/openapi.json'];

module.exports = config;
