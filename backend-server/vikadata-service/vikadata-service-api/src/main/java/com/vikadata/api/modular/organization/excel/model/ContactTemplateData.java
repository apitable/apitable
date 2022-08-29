package com.vikadata.api.modular.organization.excel.model;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.alibaba.excel.annotation.write.style.HeadFontStyle;
import lombok.Data;

/**
 * 通讯录模版
 * @author Shawn Deng
 * @date 2021-01-20 16:36:07
 */
@Data
@HeadFontStyle(fontHeightInPoints = 11)
public class ContactTemplateData {

    @ColumnWidth(15)
    @ExcelProperty(value = "成员昵称", index = 0)
    private String name;

    @ColumnWidth(70)
    @ExcelProperty(value = "邮箱", index = 1)
    private String email;

    @ColumnWidth(30)
    @ExcelProperty(value = "小组", index = 2)
    private String team;

    @ColumnWidth(20)
    @ExcelProperty(value = "职位", index = 3)
    private String position;

    @ColumnWidth(10)
    @ExcelProperty(value = "工号", index = 4)
    private String jobNumber;
}
