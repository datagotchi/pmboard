module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { targets: { node: "current" } }],
  ],
  sourceMaps: true,
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    { allowTopLevelThis: true },
  ],
  verbose: true,
};
