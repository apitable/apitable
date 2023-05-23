## What is DataBus?

DataBus is a data layer that abstracts over data management and collaboration logic. The hierarchy of entity classes in DataBus follows that of resources in APITable, i.e. datasheets, mirrors, dashboards, widgets, views, etc. The developer writes code that manipulates datasheets through DataBus, without needing to tackle the complexity of the underlying database/storage system.

The core module of DataBus is https://github.com/apitable/apitable/tree/develop/packages/core/src/databus.

## Why you need to know how to use DataBus?

DataBus plays an important role in data processing of front-end and  back-end. Understanding DataBus leads to a better grasp of how the data flow works in APITable.

## How to use DataBus in web-server/room-server?

The entrypoint of DataBus is a `DataBus` instance. Creating a `DataBus` instance requires two prodivers, a `IDataStorageProdiver` and a `IStoreProvider`. An `IDataStorageProvider` is responsible for loading data packs from a storage system, as well as storing changesets resulted from user action or client request. An `IStoreProvider` creates redux stores from the data packs returned from the `IDataStorageProvider`.

An example use of DataBus in back-end:
```typescript
class ServerDataStorageProvider implements databus. IDataStorageProvider {
    loadDatasheetPack(dstId, options) {
        // reading data pack from database ...
    }

    saveOps(ops, options) {
        // save changesets into database and update  corresponding datasheet data ...
    }
}

// Create a DataBus instance
const databus = DataBus.create({
     dataStorageProvider: new ServerDataStorageProvider(),
     storeProvider: {
        createStore: datasheetPack => {
             // create a redux store from data pack ...
        }
     },
})

// Get a Database instance. A Database corresponds to a space in APITable.
const database = databus.getDatabase();

// Get a Datasheet instance from the database
const datasheet = database.getDatasheet(datasheetId, {
    loadOptions: {
        // options that will be passed to IDataStorageProdiver.loadDatasheetPack()
    }
})

// Get a view of the datasheet
const view = datasheet.getView({
    getViewInfo(state) {
        // create view info from redux state ...
    }
})

// Get record list from the view
const records = view.getRecords({});
```

DataBus incorporates collaboration logic, so the user is able to perform operations on entity classes of DataBus:

```typescript
datasheet.updateRecords(
  [
    {
       recordId: 'rec1',
       fieldId: 'fld1',
       value: [ ... ] // new cell value
    }
  ],
  {
    // options that will be passed to IDataStorageProvider.saveOps() if the command is executed successfully.
  }
);
```

In the front-end, the usage of DataBus is nearly identical, the user provides an implementations of `IDataStorageProvider`, which loads data packs from the server and sends changesets to the server. The implementation of `IStoreProvider` simply dispatch actions to the global redux state and return it.