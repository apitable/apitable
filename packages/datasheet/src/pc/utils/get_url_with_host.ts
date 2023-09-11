import urlcat from 'urlcat';

export const getUrlWithHost = (url: string) => {
  if (url.includes('http')) {
    return url;
  }
  const origin = window.location.origin;
  return urlcat(origin, url);
};
