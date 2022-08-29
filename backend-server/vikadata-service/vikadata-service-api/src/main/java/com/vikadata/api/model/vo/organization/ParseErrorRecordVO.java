package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 解析失败详情视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("解析失败详情视图")
public class ParseErrorRecordVO {

    @Deprecated
    @ApiModelProperty(value = "行数", example = "第6行", position = 1)
    private String rowIndex;

    @ApiModelProperty(value = "行索引", example = "1", position = 2)
    private Integer rowNumber;

    @ApiModelProperty(value = "成员昵称", example = "张三", position = 3)
    private String name;

    @ApiModelProperty(value = "电子邮箱", example = "第6行", position = 4)
    private String email;

    @ApiModelProperty(value = "行数", example = "第6行", position = 5)
    private String team;

    @ApiModelProperty(value = "错误详情", example = "邮箱未填写", position = 6)
    private String message;
}
