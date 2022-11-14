# Databus 

**UNDER CONSTRUCTION**

https://vikadata.feishu.cn/wiki/wikcna2cc6wLyxXPoZT4T6p5v4e

The collaboration data stream processing and storage engine.

## TODO

- OOP transformation.
- ~~Reducer state modification by `DataBus.setCommand()`~~

### 3 Steps
- Load datapack, put in DataBus, refresh store.state.
  - 
- Add records, doCommand,  doEdit, refresh store.state.
- FieldProcessor, use DataBus to do compute ref. 

## FAQs

- If data get, is easy, no 
- Redux `command`, dispatch action and reducers?
- How `Fields` class use?
- All `Selectors` read-only, sure?
- How to modify `IDatasheet`? OT Action do this? And then how to store it?
