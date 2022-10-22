
export class DataBus {

  public static getInstance(): DataBus {
    if (DataBus._instance == null)
      DataBus._instance = new DataBus();

    return DataBus._instance;
  }

  private static _instance: DataBus;

  private constructor() {

  }

}
