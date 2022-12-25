# Storage Usage Manual

The current browser `storage` that starts with `_common_datasheet` are all data related to the datasheet.

As of now, there are 5 types of records.

1. DatasheetView: Records the last view opened by the user under the same datasheet. (**not used at the moment**) 2.
2. Description: Records the number of tables opened by the user, used for the user to open a table, if there is no record in storage, and the description of the table exists, then automatically open the description. 3.
3. IsPanelClose: record the open or collapsed state of the panel of the datasheet area. 4.
4. SplitPos: record the width of the left status bar when the panel is expanded.
5. GroupCollapse: record the group collapse and expansion status of **current count table**, **current view**.


## Data structure

### DatasheetView
To be supplemented

### Description
```ts
// where the String type is the datasheet id
type Description = string[]
```

### IsPanelClosed
```ts
type IsPanelClosed = boolean
```

### SplitPos
```ts
type SplitPos = number
```

### GroupCollapse
```ts
type GroupCollapse = {
    // The key here is the datasheet id + view id
    [key:string]:{
        // The key here is the group id (aka path)
        [key:string]: boolean
    }
}
```

## Clear data saved in namespace

After logging in, the user clears all the storage data associated with the table to keep the space pure, but every time a table with a fish node description is opened, the description box pops up, which is annoying. Therefore, it is necessary to differentiate the data and configure in `LogInClearConfig` whether the corresponding key should clear the data after logging in.