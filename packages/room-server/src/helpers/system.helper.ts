import * as os from 'os';

/**
 * 获取本地允许的IP地址
 */
export const getIPAddress = (): string => {
  if(process.env.NEST_CUSTOMIZE_IP){
    return process.env.NEST_CUSTOMIZE_IP;
  }
  // 服务器本机地址
  const interfaces = os.networkInterfaces();
  let address: string;
  for (const devName of Object.keys(interfaces)) {
    const iface = interfaces[devName];
    for (const i of Object.keys(iface)) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        address = alias.address;
      }
    }
  }
  return address;
};