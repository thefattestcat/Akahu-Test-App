const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:7000",
            changeOrigin: true,
        })
    );
};
