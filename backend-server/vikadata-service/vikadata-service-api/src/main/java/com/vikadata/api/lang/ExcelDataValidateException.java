package com.vikadata.api.lang;

import com.vikadata.api.model.dto.asset.UploadDataDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * Excel单元格校验异常
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/18 01:44
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
