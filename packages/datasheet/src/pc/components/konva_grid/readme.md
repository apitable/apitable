# 概览
本模块是表格视图的 Canvas 版本，主要目的是提升表格的渲染性能，目前底层的渲染引擎由 [Konva](https://konvajs.org/) 绘图框架提供。


# 功能简介
本模块主要包含两大块：
1. Canvas 画布中，存在一套 Canvas 的坐标系，对表格整体布局、单元格 CellValue 都进行了绘制，其相对坐标系的偏移量主要通过 offset 进行控制。
2. dom_grid 中存在一套 DOM 坐标系，它提供了能在 Canvas 对应坐标中插入 DOM 元素的能力，Editor、ContextMenu 等 DOM 元素也是由此集成进去的，其相对坐标系的偏移量由 transform 属性提供。


# 模块目录结构

## context 文件夹
- KonvaGridContext
- KonvaGridViewContext

## components 文件夹
其中包含了一些业务组件，如 CellValue、统计栏、列头等组件

## hooks 文件夹
- `.tsx` 文件：与渲染相关的 hooks，目的是输出各种小模块的渲染组件，供调用方进行拼装
- `.ts` 文件：包含画布上的一些交互事件，如 mouseEvent、touchEvent 等事件

## model 文件夹
其中包含两个基础模型：

### Layout
处理 grid 布局相关逻辑，基于 GridLayout 衍生出 GroupTabLayout、BlankRowLayout、AddRowLayout 和 RecordRowLayout 四个类，分别负责 分组组头、空白行、添加行 和 记录行 的布局

### Coordinate
用于构建 Canvas 基础坐标系，基于 Coordinate 基础坐标系类衍生出 GridCoordinate 和 GanttCoordinate 类，分别负责 表格视图 和 甘特视图 的坐标排布

## utils 文件夹
包含一些常用的帮助函数，如获取字符串宽度并进行缓存、获取缓存图片、自定义 Shape 进行绘制的基础方法等
