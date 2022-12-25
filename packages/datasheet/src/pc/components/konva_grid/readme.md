# Overview
This module is a Canvas version of the grid view, the main purpose is to improve the rendering performance of the grid, the underlying rendering engine is currently provided by the [Konva](https://konvajs.org/) drawing framework.


# Introduction
This module contains two main blocks:
1. the Canvas canvas, there is a set of Canvas coordinate system, the overall layout of the table, cell CellValue are drawn, its offset relative to the coordinate system is mainly controlled by offset.
2. dom_grid has a set of DOM coordinate system, which provides the ability to insert DOM elements in the corresponding coordinates of Canvas, and the DOM elements such as Editor and ContextMenu are also integrated into it.


# Module Catalog Structure

## context
- KonvaGridContext
- KonvaGridViewContext

## components
It contains some business components, such as CellValue, statistics columns, column headers and other components.

## hooks
- `.tsx` files：Rendering-related hooks, designed to export rendering components of various small modules for the caller to assemble.
- `.ts` files: MouseEvent、touchEvent etc. events.

## model
Two base models are included.

### Layout
Handle grid layout-related logic, based on GridLayout derived from the GroupTabLayout, BlankRowLayout, AddRowLayout and RecordRowLayout four classes, respectively responsible for group group header, blank row, add row and record row layout.

### Coordinate
The GridCoordinate and GanttCoordinate classes are derived from the Coordinate base coordinate system class and are responsible for the coordinate layout of the table view and Gantt view respectively.

## utils
Contains some common helper functions, such as get string width and cache, get cached image, custom Shape for drawing base method, etc.
