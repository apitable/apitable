package com.vikadata.api.enums.datasheet;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * field type
 * </p>
 *
 * @author Benson Cheung
 */
@Getter
@AllArgsConstructor
public enum FieldType {

    NOT_SUPPORT(0),

    TEXT(1),

    NUMBER(2),

    SINGLE_SELECT(3),

    MULTI_SELECT(4),

    DATETIME(5),

    ATTACHMENT(6),

    LINK(7),

    URL(8),

    EMAIL(9),

    PHONE(10),

    CHECKBOX(11),

    RATING(12),

    MEMBER(13),

    LOOKUP(14),

    ROLLUP(15),

    FORMULA(16),

    CURRENCY(17),

    PERCENT(18),

    SINGLE_TEXT(19),

    AUTO_NUMBER(20),

    CREATED_TIME(21),

    LAST_MODIFIED_TIME(22),

    CREATED_BY(23),

    LAST_MODIFIED_BY(24);

    private final int fieldType;

    public static FieldType create(int fieldType) {
        for (FieldType type : FieldType.values()) {
            if (type.getFieldType() == fieldType) {
                return type;
            }
        }
        return NOT_SUPPORT;
    }
}
