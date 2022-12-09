package com.vikadata.api.interfaces.widget.facade;

import java.util.List;

import com.vikadata.api.interfaces.widget.model.WidgetCopyOption;

public interface WidgetServiceFacade {

    String getSpaceIdByWidgetId(String widgetId);

    void checkWidgetReference(List<String> childrenNodeIds, List<String> widgetIds);

    void copyWidget(WidgetCopyOption copyOption);
}
