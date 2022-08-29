package com.vikadata.api.model.dto.widget;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 组件dto
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class WidgetDTO extends DatasheetWidgetDTO {

    private String nodeId;
}
