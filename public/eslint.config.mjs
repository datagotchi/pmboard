import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  jsdoc.configs["flat/recommended-error"],
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["**/bower_components/"],
    plugins: {
      jsdoc,
    },
    rules: {
      "react/prop-types": "off",
    },
  },
  { languageOptions: { globals: globals.browser } },
];
