package com.vikadata.api.enums.template;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Template Type
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum TemplateType {

    OFFICIAL(0),

    SPACE(1),

    MARKETPLACE(2);

    private final int type;
}
