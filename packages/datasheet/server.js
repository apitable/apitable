require('dotenv').config();
const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = parseInt(process.env.WEB_SERVER_PORT, 10) || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDevelopment, port, hostname: 'localhost' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  if (isDevelopment) {
    server.use(
      '/nest',
      createProxyMiddleware({
        // 直连本地NodeJS环境
        target: process.env.API_PROXY || 'http://127.0.0.1:3333',
        changeOrigin: true,
        cookieDomainRewrite: '',
      })
    );

    server.use(
      '/api',
      createProxyMiddleware({
        target: process.env.API_PROXY || 'http://127.0.0.1:8081',
        changeOrigin: true,
        cookieDomainRewrite: '',
      })
    );

    server.use(
      '/fusion',
      createProxyMiddleware({
        target: process.env.API_PROXY || 'https://integration.vika.ltd',
        changeOrigin: true,
        cookieDomainRewrite: '',
      })
    );

    server.use(createProxyMiddleware('/room', {
      target: process.env.API_PROXY || 'http://127.0.0.1:3005',
      ws: true,
      changeOrigin: true,
      cookieDomainRewrite: ''
    }));

    server.use(createProxyMiddleware('/notification', {
      target: process.env.API_PROXY || 'http://127.0.0.1:3002',
      ws: true,
      changeOrigin: true,
      cookieDomainRewrite: ''
    }));

    server.use(
      '/vk-assets-ltd',
      createProxyMiddleware({
        target:
          'http://ec2-161-189-141-24.cn-northwest-1.compute.amazonaws.com.cn',
        changeOrigin: true,
      })
    );

    server.use(
      '/unsafe',
      createProxyMiddleware({
        target:
          'http://ec2-161-189-141-24.cn-northwest-1.compute.amazonaws.com.cn',
        changeOrigin: true,
      })
    );
  }

  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

