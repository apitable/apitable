package com.vikadata.api.model.dto.widget;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 数表组件关联信息
 * </p>
 *
 * @author Chambers
 * @date 2021/01/11
 */
@Data
@NoArgsConstructor
public class DatasheetWidgetDTO {

    private String dstId;

    private String widgetId;

    private String sourceId;

    public DatasheetWidgetDTO(String dstId, String sourceId) {
        this.dstId = dstId;
        this.sourceId = sourceId;
    }
}
