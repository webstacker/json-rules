const config = {
    tabWidth: 4,
    singleQuote: true,
    printWidth: 100,
    bracketSpacing: false
};

config.overrides = [
    {
        files: ['*.yaml', '*.yml'],
        options: {
            tabWidth: 2
        }
    }
]

module.exports = config;
