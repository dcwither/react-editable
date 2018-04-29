const path = require("path");

module.exports = (baseConfig, env) => {
  baseConfig.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      loader: require.resolve("ts-loader")
    },
    {
      test: /\.css$/,
      loaders: ["style-loader", "css-loader"],
      include: path.resolve(__dirname, "../")
    },
    {
      test: /\.md$/,
      use: "raw-loader"
    }
  );
  baseConfig.resolve.extensions.push(".ts", ".tsx");
  return baseConfig;
};
