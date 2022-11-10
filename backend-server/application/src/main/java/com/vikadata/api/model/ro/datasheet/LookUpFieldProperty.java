package com.vikadata.api.model.ro.datasheet;

import lombok.Data;

/**
 * <p>
 * lookup Field Properties
 * </p>
 */
@Data
public class LookUpFieldProperty {

    /**
     * Mapping associated field ID
     */
    private String relatedLinkFieldId;

    /**
     * lookup Target Field ID
     */
    private String lookUpTargetFieldId;

    /**
     * DataSheet ID
     */
    private String datasheetId;
}
