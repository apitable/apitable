export class FieldManager {
  private static validator = {};

  public static setService(fieldTypeName: string, validator: any) {
    this.validator[fieldTypeName] = validator;
  }

  public static findService(fieldTypeName: string): any {
    return this.validator[fieldTypeName];
  }
}
