const { override, addWebpackPlugin } = require('customize-cra')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const { aliasDangerous, configPaths } = require('react-app-rewire-alias/lib/aliasDangerous')

module.exports = (config, env) => {
  return override(
    addWebpackPlugin(new ImageMinimizerPlugin({
      deleteOriginalAssets: false,
      generator: [
        {
          type: "asset",
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: ["imagemin-webp"],
          }
        }
      ]
    })),
    aliasDangerous(configPaths('./tsconfig.paths.json'))
  )(config, env)
}