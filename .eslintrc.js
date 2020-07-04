module.exports = {
    env: {
        browser: false,
        es6: true
    },
    settings: {
        react: {
            pragma: 'React',
            version: '16.2' //"detect"
        }
    },
    extends: ['alloy'],
    plugins: ['@typescript-eslint'],
    globals: {
        //Atomics: "readonly"
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        quotes: [1, 'single'],
        semi: 0,
        camelcase: 'off',
        'new-cap': 'off',
        'no-new': 'off',
        'object-curly-spacing': 'off',
        'no-octal-escape': 0,
        'no-var': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'no-console': 'warn',
        'no-tabs': 'off',
        'prefer-promise-reject-errors': 'warn',
        'react/prop-types': 'off',
        'lines-between-class-members': 'off',
        'no-mixed-operators': 'off',
        'space-before-function-paren': 'off',
        'react/react-in-jsx-scope': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        'max-len': 0,
        'spaced-comment': 0,
        'max-params': ['error', 5],
        '@typescript-eslint/prefer-optional-chain': 0,
        'arrow-parens': 1,
        indent: 0
    }
};
