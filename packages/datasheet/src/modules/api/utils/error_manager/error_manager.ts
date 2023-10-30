export class ApiErrorManager {
  private errorHandlersMap: Map<number, () => void>;

  constructor() {
    this.errorHandlersMap = new Map();
  }

  registerErrorHandler(code: number, handler: () => void) {
    this.errorHandlersMap.set(code, handler);
  }

  handleError(code: number) {
    const handler = this.errorHandlersMap.get(code);
    if (handler) {
      handler();
      throw new Error();
    } else {
      console.error('Unhandled error code:', code);
    }
  }
}
