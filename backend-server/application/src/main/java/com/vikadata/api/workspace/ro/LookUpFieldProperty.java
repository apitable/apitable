package com.vikadata.api.workspace.ro;

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
