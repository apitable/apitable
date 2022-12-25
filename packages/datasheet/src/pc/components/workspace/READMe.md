## Switching views

In the old logic, there were two forms of switching views.
1. Monitor the parameters on Url and actively modify the `activeView` in `redux`.
2. Based on user interaction, first change the `activeView` in the `redux`, and then switch the route by listening to the change of the value.

These two logics are arguably at odds with each other and are not well maintained.

So considering that data and URLs are bound, it is perfectly possible to go one way, by modifying the route, listening for changes in the route and subsequently modifying the data in the `redux`. In this way, the view changes can be bound to the route.

There are two special cases here.
1. The `viewId` exists on the route, but the data of the current `datasheet` has not been loaded yet, and the change of the view is meaningless at this point.
2. The `viewId` does not exist on the current route.

The above special cases require special judgments about the view's routing. Such as automatically jumping to the first route in the view list and listening to the `datasheetId` in the `redux`.
