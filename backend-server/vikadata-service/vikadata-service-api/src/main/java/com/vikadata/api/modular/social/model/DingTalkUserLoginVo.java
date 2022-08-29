package com.vikadata.api.modular.social.model;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.model.vo.space.SpaceVO;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * 钉钉用户登录请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-15 12:15:47
 */
@ApiModel("钉钉应用用户登录返回信息")
@Data
public class DingTalkUserLoginVo {

    @ApiModelProperty(value = "空间列表", position = 1)
    private List<SpaceVO> spaces;

    @ApiModelProperty(value = "企业已激活成员数量", position = 2)
    private Integer activeMemberCount;

    @ApiModelProperty(value = "应用绑定的空间站ID", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String bindSpaceId;
}
