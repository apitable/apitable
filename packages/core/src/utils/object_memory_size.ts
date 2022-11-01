export function memorySizeOf(obj: any) {
  let bytes = 0;

  function sizeOf(obj: any) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          const objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (const key in obj) {
              if (!obj.hasOwnProperty(key)) {
                continue;
              }
              sizeOf(obj[key]);
            }
          } else {
            bytes += obj.toString().length * 2;
          }
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes: number): number {
    // if (bytes < 1024) {
    //   return bytes + ' bytes';
    // } else if (bytes < 1048576) {
    //   return (bytes / 1024).toFixed(3) + ' KiB';
    // } else if (bytes < 1073741824) {
    //   return (bytes / 1048576).toFixed(3) + ' MiB';
    // }
    // return (bytes / 1073741824).toFixed(3) + ' GiB';
    return Number((bytes / 1048576).toFixed(3));
  }

  return formatByteSize(sizeOf(obj));
}
