## Storybook

Github action 会打包组件库的文档，限定 `story/*` 格式分支名：

### docker 启动 storybook 文档

```
docker run --rm -d -p 3001:80 --name=components-book docker.vika.ltd/vikadata/vika/component-doc
```

浏览器打开 `http://localhost:3001/` 即可访问。