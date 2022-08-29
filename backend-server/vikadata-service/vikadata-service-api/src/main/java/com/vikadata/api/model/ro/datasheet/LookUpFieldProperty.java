package com.vikadata.api.model.ro.datasheet;

import lombok.Data;

/**
 * <p>
 * lookup 字段属性
 * </p>
 *
 * @author Chambers
 * @date 2020/5/13
 */
@Data
public class LookUpFieldProperty {

    /**
     * 映射关联字段ID
     */
    private String relatedLinkFieldId;

    /**
     * lookup 目标字段ID
     */
    private String lookUpTargetFieldId;

    /**
     * 数表ID
     */
    private String datasheetId;
}
