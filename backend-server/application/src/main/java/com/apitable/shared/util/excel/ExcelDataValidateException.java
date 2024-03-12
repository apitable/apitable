/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.util.excel;

import com.apitable.organization.dto.UploadDataDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * <p>
 * Excel cell data validate exception.
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ExcelDataValidateException extends RuntimeException {

    private Integer rowIndex;

    private UploadDataDTO rowData;

    /**
     * constructor.
     *
     * @param rowIndex row index
     * @param rowData  row data
     * @param message  error message
     */
    public ExcelDataValidateException(Integer rowIndex, UploadDataDTO rowData, String message) {
        super(message);
        this.rowIndex = rowIndex;
        this.rowData = rowData;
    }
}
