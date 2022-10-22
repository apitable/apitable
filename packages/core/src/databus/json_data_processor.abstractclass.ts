
/**
 * All data in DataBus are JSON. 
 * JsonDataProcessor define the getter to get the JSON data source 
 */
export abstract class JsonDataProcessor<T> {

  _dataSource: T;

  constructor(dataSource: T) {
    this._dataSource = dataSource;
  }

  /**
   * Data source of this handler
   */
  public getDataSource(): T {
    return this._dataSource;
  }

}

/**
 * Some data processor the sub processor from other handler
 * define the getter to get the Top JSON Data source
 * 
 * Example:
 * 
 * 
 * A DataProcessor's data source {a: {b: 1}}
 * B DataProcessor's data source {b: 1},  so its top data source is A's data source
 */
export abstract class SubJsonDataProcessor<T, J> extends JsonDataProcessor<T> {

  private _topDataSource: J;

  constructor(dataSource: T, topDataSource: J) {
    super(dataSource);
    this._topDataSource = topDataSource;
  }

  public getTopDataSource(): J {
    return this._topDataSource;
  }
}