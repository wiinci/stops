// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true,
  },
  extends: ["plugin:vue/recommended", "airbnb-base"],
  // required to lint *.vue files
  plugins: [
    "vue"
  ],
  // check if imports actually resolve
  settings: {
    "import/resolver": {
      webpack: {
        config: "build/webpack.base.conf.js"
      }
    }
  },
  // add your custom rules here
  rules: {
    "arrow-parens": ["warn", "as-needed"],
    "comma-dangle": ["warn", "only-multiline"],
    "func-names": "off",
    "global-require": "off",
    "indent": ["warn", 2],
    "max-len": "off",
    "no-console": "off",
    "no-mixed-operators": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-undef": ["warn"],
    "no-underscore-dangle": "off",
    "object-curly-spacing": ["warn", "always"],
    "prefer-arrow-callback": "off",
    "quote-props": ["error", "consistent-as-needed"],
    "quotes": ["warn", "double", { avoidEscape: true }],

    // don"t require .vue extension when importing
    "import/extensions": ["error", "always", {
      js: "never",
      vue: "never",
      less: "never"
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    "no-param-reassign": ["error", {
      props: true,
      ignorePropertyModificationsFor: [
        "state", // for vuex state
        "acc", // for reduce accumulators
        "e" // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    "import/no-extraneous-dependencies": ["error", {
      optionalDependencies: ["test/unit/index.js"]
    }],
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

    // Vue settings
    "vue/html-indent": [
      "warn",
      2,
      {
        attribute: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
      }
    ],
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 1,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "always"
      }
    ]
  }
}
