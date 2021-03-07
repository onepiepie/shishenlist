//setupProxy.js
const proxy = require('http-proxy-middleware');
 
module.exports = function (app) {
    app.use(
        "/api", proxy.createProxyMiddleware({
            target: 'https://yys.res.netease.com/',
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
            },
            "secure": true        
        },),
    );
    app.use(
        "/api02", proxy.createProxyMiddleware({
            target: "https://g37simulator.webapp.163.com/",
            changeOrigin: true,
            pathRewrite: {
                "^/api02": ""
            },
            "secure": true
    },)
    );
};