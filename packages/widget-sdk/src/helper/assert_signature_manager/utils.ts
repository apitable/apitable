export const splitAssertPath = (url: string) => {
  const index = ['space', 'public', 'image', 'widget', 'assets'].map((path) => url.indexOf(path)).find((index) => index !== -1);

  if (!index || index === -1) {
    return url;
  }

  return url.slice(index);
};
