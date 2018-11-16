module.exports = {
  assetsDir: 'static',
  lintOnSave: true,

  devServer: {
    proxy: {
      '/api': { target: 'http://localhost:3000', ws: true },
      '/pic': { target: 'http://localhost:3000' },
    },
  },

  configureWebpack: {
    devtool: 'source-map',
  },
};
