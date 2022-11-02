package com.vikadata.api.model.dto.widget;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class WidgetDTO extends DatasheetWidgetDTO {

    private String nodeId;
}
