package com.vikadata.api.workspace.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * DataSheet Exception
 * status code range（440-449）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum DataSheetException implements BaseException {

    DATASHEET_NOT_EXIST(440, "sheet does not exist"),

    VIEW_NOT_EXIST(440, "view does not exist"),

    FIELD_NOT_EXIST(440, "field does not exist"),

    CREATE_FAIL(442, "failed to create file"),

    ATTACH_CITE_FAIL(443, "attachment reference calculation failed");

    private final Integer code;

    private final String message;
}
