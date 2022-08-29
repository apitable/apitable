// core 内的计算逻辑有时候要区分是客户端还是服务端。
export const isServer = () => typeof global === 'object' && global.process && !global['document'];
export const isClient = () => typeof global === 'object' && global['document'];