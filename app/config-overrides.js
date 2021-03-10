const {override, addWebpackPlugin} = require('customize-cra')
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const {aliasDangerous, configPaths} = require('react-app-rewire-alias/lib/aliasDangerous')

module.exports = (config, env) => {
  config.module.rules.splice(0, 0, {
    test: /\.worker\.(js|ts)$/i,
    use: [{
      loader: 'comlink-loader',
      options: {
        singleton: true
      }
    }]
  })
  return override(
    addWebpackPlugin(new ImageminWebpWebpackPlugin()),
    aliasDangerous(configPaths('./tsconfig.paths.json'))
  )(config, env)
}