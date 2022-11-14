package com.vikadata.api.enterprise.widget.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class WidgetDTO extends DatasheetWidgetDTO {

    private String nodeId;
}
