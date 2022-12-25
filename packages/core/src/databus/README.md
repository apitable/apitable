# DataBus

**NOTE: This library is a work in progress, APIs may change in the future.**

https://vikadata.feishu.cn/wiki/wikcna2cc6wLyxXPoZT4T6p5v4e

The collaborative data stream processing and storage engine.

## Basic Usage

```typescript
// Create a DataBus instance.
const databus = DataBus.create({
  // The data loader is responsible for loading internal datasheet packs of datasheets.
  // A data loader must implement the IDataLoader interface.
  dataLoader: new MyDataLoader(),

  // The data saver is responsible for saving the results of executing commands into some storage system.
  // A data saver must implement the IDataSaver interface.
  dataSaver: new MyDataSaver(),

  // The store provider is responsible for creating redux stores for datasheets.
  // A store provider must implement the IStoreProvider interface.
  storeProvider: new MyStoreProvider(),
});

// Get a database
const database = databus.getDatabase();

// Get a datasheet in the database
const datasheet = await database.getDatasheet(datasheetId, options);

// Add an event handler to this datasheet
datasheet.addEventHandler(new MyEventHandler());

// Get a view in the datasheet.
const view = await datasheet.getView(options);

// Perform a command on the view.
const result = await view.doCommand({
  cmd: CollaCommandName.MoveRow,
  ... // other fields for this command
});
```

Please read the API documentation for further usage.

## TODO

- Auto reloading updated data for datasheets and other components (views/records) after changes (e.g. by `doCommand`).