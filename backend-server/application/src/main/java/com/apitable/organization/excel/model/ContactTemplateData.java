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

package com.apitable.organization.excel.model;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.alibaba.excel.annotation.write.style.HeadFontStyle;
import lombok.Data;

/**
 * contact template data.
 */
@Data
@HeadFontStyle(fontHeightInPoints = 11)
public class ContactTemplateData {

    @ColumnWidth(15)
    @ExcelProperty(value = "member name", index = 0)
    private String name;

    @ColumnWidth(70)
    @ExcelProperty(value = "email", index = 1)
    private String email;

    @ColumnWidth(30)
    @ExcelProperty(value = "team", index = 2)
    private String team;

    @ColumnWidth(20)
    @ExcelProperty(value = "position", index = 3)
    private String position;

    @ColumnWidth(10)
    @ExcelProperty(value = "job number", index = 4)
    private String jobNumber;
}
