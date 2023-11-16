export class CustomError extends Error {
  code!: number;

  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }
}
