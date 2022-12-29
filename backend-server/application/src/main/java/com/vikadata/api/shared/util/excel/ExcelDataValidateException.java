package com.vikadata.api.shared.util.excel;

import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.organization.dto.UploadDataDTO;

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

    private UploadDataDTO rowData;

    public ExcelDataValidateException(Integer rowIndex, UploadDataDTO rowData, String message) {
        super(message);
        this.rowIndex = rowIndex;
        this.rowData = rowData;
    }
}
