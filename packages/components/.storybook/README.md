## Storybook

Github action will package the document of the component library, and limit the branch name in `story/*` format:

### docker start storybook document

```
docker run --rm -d -p 3001:80 --name=components-book apitable/component-doc
```

Open `http://localhost:3001/` in the browser to access.