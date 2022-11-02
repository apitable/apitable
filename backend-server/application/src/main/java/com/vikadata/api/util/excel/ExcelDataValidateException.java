package com.vikadata.api.util.excel;

import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.model.dto.asset.UploadDataDto;

/**
 * <p>
 * Excel cell data validate exception
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ExcelDataValidateException extends RuntimeException {

    private Integer rowIndex;

    private UploadDataDto rowData;

    public ExcelDataValidateException(Integer rowIndex, UploadDataDto rowData, String message) {
        super(message);
        this.rowIndex = rowIndex;
        this.rowData = rowData;
    }
}
