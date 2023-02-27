# DataBus

**NOTE: This library is a work in progress, APIs may change in the future.**

https://vikadata.feishu.cn/wiki/wikcna2cc6wLyxXPoZT4T6p5v4e

The data processing layer for APITable, providing a collaboration engine and friendly interface.

## Basic Usage

```typescript
// Create a DataBus instance.
const databus = DataBus.create({
  // The data storage provider is responsible for loading internal datasheet packs of datasheets, as well as
  // storing results of command execution into a storage system.
  // A data storage provider must implement the IDataStorageProvider interface.
  dataStorageProvider: new MyStorageProvider(),

  // The store provider is responsible for creating redux stores for datasheets.
  // A store provider must implement the IStoreProvider interface.
  storeProvider: new MyStoreProvider(),
});

// Get a database
const database = databus.getDatabase();

// Add an event handler to the database
database.addEventHandler(new MyEventHandler());

// Get a datasheet in the database
const datasheet = await database.getDatasheet(datasheetId, datasheetOptions);

// Get a view in the datasheet.
const view = await datasheet.getView(viewOptions);

// Add 10 empty records to the datasheet. Other commands are also available in `View`s and `Datasheet`s.
const result = await view.addRecords({
  index: 0,
  count: 10,
});
```

Please read the API documentation for further usage.

## TODO

- Auto reloading updated data for datasheets and other components (views/records) after changes (e.g. by `doCommand`).