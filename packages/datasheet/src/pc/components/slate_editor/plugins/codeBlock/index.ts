import 'prismjs/themes/prism.css';

export * from './language';

export const getTokenLength = (token: any): number => {
  if (typeof token === 'string') {
    return token.length;
  } else if (typeof token.content === 'string') {
    return token.content.length;
  }
  return token.content.reduce((l: number, t: any) => l + getTokenLength(t), 0);
};

