const js = require("@eslint/js");

module.exports = [
    // Standalone object with ONLY ignores applies globally in ESLint 9
    { ignores: ["node_modules/**", "public/**", "views/**", "clean-code.js", "fix-linter.js", "make_angles.js", "fix-admin-icon.js", "*.json"] },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                require: "readonly",
                module: "readonly",
                exports: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                Buffer: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                Promise: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "off",
            "no-undef": "error",
            "no-empty": "off",
            "no-redeclare": "off",
            "no-constant-condition": "off"
        }
    }
];
