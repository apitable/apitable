package com.vikadata.api.modular.organization.excel.model;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.alibaba.excel.annotation.write.style.HeadFontStyle;
import lombok.Data;

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
