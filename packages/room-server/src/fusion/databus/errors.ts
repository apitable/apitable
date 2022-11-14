export class ViewNotFoundError extends Error {
  constructor(public readonly dstId: string, public readonly viewId: string) {
    super();
  }
}
