package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 钉钉应用租户绑定空间站请求参数
 * </p>
 * @author zoe zheng
 * @date 2021/5/10 6:51 下午
 */
@Data
@ApiModel("钉钉应用租户绑定空间站请求参数")
public class DingTalkAgentBindSpaceDTO {

    @ApiModelProperty(value = "空间站标识", example = "spc2123hjhasd")
    private String spaceId;
}
