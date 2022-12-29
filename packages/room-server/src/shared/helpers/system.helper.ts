import * as os from 'os';

/**
 * get the IP address
 */
export const getIPAddress = (): string => {
  if(process.env.NEST_CUSTOMIZE_IP){
    return process.env.NEST_CUSTOMIZE_IP;
  }
  // server local address
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