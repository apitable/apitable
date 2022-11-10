package com.vikadata.api.model.ro.datasheet;

import lombok.Data;

/**
 * <p>
 * Date Field Properties
 * </p>
 */
@Data
public class DateFieldProperty {

    /**
     * Date Format Type
     */
    private int dateFormat;

    /**
     * Time Format Type
     */
    private int timeFormat;

    /**
     * Include time or not
     */
    private boolean includeTime;

    /**
     * Auto Fill
     */
    private boolean autoFill;

}
