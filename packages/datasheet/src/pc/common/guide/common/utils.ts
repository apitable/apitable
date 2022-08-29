export const getStyleProperty = (element, propertyName, prefixVendor = false) => {
  if (prefixVendor) {
    const prefixes = ['', '-webkit-', '-ms-', 'moz-', '-o-'];
    for (let counter = 0; counter < prefixes.length; counter++) {
      const prefixedProperty = prefixes[counter] + propertyName;
      const foundValue = getStyleProperty(element, prefixedProperty);

      if (foundValue) {
        return foundValue;
      }
    }

    return '';
  }

  let propertyValue = '';

  if (element.currentStyle) {
    propertyValue = element.currentStyle[propertyName];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    propertyValue = document.defaultView
      .getComputedStyle(element, null)
      .getPropertyValue(propertyName);
  }

  return propertyValue && propertyValue.toLowerCase ? propertyValue.toLowerCase() : propertyValue;
};

// 将对象格式的style转换为字符串格式
export const stringifyStyleObject = (styleObj: React.CSSProperties) => {
  const arr: string[] = [];
  Object.keys(styleObj).forEach(key => {
    const formateKey = key.split('').map(i => i.match(/[A-Z]/) ? `-${i.toLocaleLowerCase()}` : i).join('');
    const curStyle = `${formateKey}: ${styleObj[key]}`;
    arr.push(curStyle);
  });
  return arr.join(';');
};

