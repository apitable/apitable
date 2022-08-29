package com.vikadata.api.model.ro.player;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 活动状态参数
 * </p>
 *
 * @author Chambers
 * @date 2020/6/9
 */
@Data
@ApiModel("活动状态参数")
public class ActivityStatusRo {

    @ApiModelProperty(value = "引导ID。具体信息查看 airtable 的 config表", dataType = "java.lang.Integer", example = "1", required = true)
    @NotNull(message = "引导ID不能为空")
    private Integer wizardId;

}
