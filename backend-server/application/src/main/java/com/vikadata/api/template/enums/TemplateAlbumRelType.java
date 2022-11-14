package com.vikadata.api.template.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Template Center - Template Album Rel Type
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum TemplateAlbumRelType {

    /**
     * TEMPLATE CATEGORY
     */
    TEMPLATE_CATEGORY(0),

    /**
     * TEMPLATE
     */
    TEMPLATE(1),

    /**
     * TEMPLATE TAG
     */
    TEMPLATE_TAG(2),

    ;


    private int type;
}
