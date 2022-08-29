export const socketGuard = () => {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    let ignoreSocketError = false;
    let timeout;
    const socketErrCodes = [50000, 50001];
    descriptor.value = function(this: any, ...arg: any[]): any {
      if (!this.io.socket.connected) {
        return (() => {})();
      }
      if (socketErrCodes.includes(arg[0]?.code)) {
        if (ignoreSocketError) {
          ignoreSocketError = false;
          timeout && clearTimeout(timeout);
          return originalMethod.apply(this, [...arg, false]);
        }
        ignoreSocketError = true;
        timeout = setTimeout(() => {
          ignoreSocketError = false;
        }, 15 * 1000);
        return;
      }

      return originalMethod.apply(this, arg);
    };
    return descriptor;
  };
};
