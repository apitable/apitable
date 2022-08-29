package com.vikadata.api.model.ro.datasheet;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 提及成员请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/5/28
 */
@Data
@ApiModel("提及成员请求参数")
public class RemindMemberRo {

    @ApiModelProperty(value = "是否开启通知", example = "true", required = true)
    @NotNull(message = "是否开启通知不能为空")
    private Boolean isNotify;

    @ApiModelProperty(value = "节点ID", example = "dstiHMuQnhWkVxBKkU", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "视图ID", example = "viwwkxEZ3XaDg", position = 2)
    private String viewId;

    @ApiModelProperty(value = "组织单元和记录列表", position = 3, required = true)
    @NotEmpty(message = "组织单元和记录列表不能为空")
    private List<RemindUnitRecRo> unitRecs;

    @ApiModelProperty(value = "关联ID：节点分享ID、模板ID", example = "shr8T8vAfehg3yj3McmDG", position = 4)
    private String linkId;

    @ApiModelProperty(value = "发送通知的类型:1 成员通知，2 评论通知", example = "1", position = 5)
    private Integer type = 1;

    @ApiModelProperty(value = "发送邮件通知的附加内容", example = "@aaa&nbsp;&nbsp;不正确", position = 6)
    private RemindExtraRo extra = null;
}
