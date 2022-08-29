# Redux Slices
> https://redux.js.org/tutorials/essentials/part-2-app-structure

A "slice" is a collection of Redux reducer logic and actions for a single feature in your app, typically defined together in a single file. The name comes from splitting up the root Redux state object into multiple "slices" of state.

“切片”是应用程序中单个功能的 Redux reducer 逻辑和操作的集合，通常在单个文件中一起定义。该名称来自将根 Redux 状态对象拆分为多个状态“切片”。

这里我们将数表的 state 和 widget 的 state 创建为不同的 “切片”，每个切片中包含完整的 action/reducer/selector
