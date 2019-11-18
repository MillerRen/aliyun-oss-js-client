const path = require('path')

module.exports = {
  mode: 'production',
  entry: './client.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'oss.js',
    library: 'OSS',
    libraryTarget: 'umd'
  }
}
