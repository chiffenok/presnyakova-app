const proxy = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/api",
    proxy({
      target: "https://www.lottoland.com/",
      changeOrigin: true
    })
  );
};