declare module 'react-dom/client' {
  // typing module default export as `any` will allow you to access its members without compiler warning
  const createRoot: any;
  export { createRoot };
}