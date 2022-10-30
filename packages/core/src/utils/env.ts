// The logic in the `core` sometimes needs to distinguish between the client and the server.
export const isServer = () => typeof global === 'object' && global.process && !global['document'];
export const isClient = () => typeof global === 'object' && global['document'];