package com.vikadata.api.model.ro.datasheet;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 评论具体内容
 * </p>
 *
 * @author zoe zheng
 * @date 2020/11/19 5:09 下午
 */
@Data
@ApiModel("提醒的其它内容")
public class RemindExtraRo {

    @Deprecated
    @ApiModelProperty(value = "记录标题", example = "我是第一列", position = 1, required = true)
    private String recordTitle;

    @ApiModelProperty(value = "评论内容", example = "@zoe&nbsp;&nbsp;评论内容", position = 2, required = true)
    @NotEmpty(message = "评论内容")
    private String content;

    @Deprecated
    @ApiModelProperty(value = "评论时间", example = "2020.11.26 10:30:36", position = 3, required = true)
    @NotEmpty(message = "评论时间")
    private String createdAt;

}
