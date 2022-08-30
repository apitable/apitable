export const imageCache = (() => {
  const imageMap: { [name: string]: any } = {};
  const imgPromises: any = [];

  function loadImage(name, src) {
    imgPromises.push(new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'Anonymous';
      
      try {
        img.onload = () => {
          imageMap[name] = {
            img,
            success: true
          };

          resolve({
            name,
            img
          });
        };
      } catch (err) {
        imageMap[name] = {
          img,
          success: false
        };
        reject(err);
      }
    }));
  }

  function loadImageMap(urlMap) {
    Object.keys(urlMap).forEach(key => {
      loadImage(key, urlMap[key]);
    });
  }
  
  function imageMapOnload(callback) {
    Promise.all(imgPromises).then(callback);
  }

  function getImage(name) {
    const imgInfo = imageMap[name];

    if (imgInfo == null) {
      return null;
    }

    const { img, success } = imgInfo;

    if (!success) return false;
    return img;
  }

  return {
    loadImage,
    loadImageMap,
    getImage,
    imageMapOnload,
    imageMap
  };
})();
