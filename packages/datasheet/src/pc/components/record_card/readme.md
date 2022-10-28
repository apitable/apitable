# RecordCard 

Showcards in Gallery View and Kanban View


## Height calculation

The card does not need to care about its overall height, it only needs to consider whether the empty value field displays content and the occupancy height of the empty value field.

The corresponding card height calculation is done by the parent component. The grid / list passed to the react-window is used to calculate the padding for virtual scrolling.

### Card height calculation

+ padding-top 8px 
+ header 
+ body 
  + title
  + sum（fieldName + cellValue）
+ padding-bottom 8px

Simplify: header + body + 8*2 