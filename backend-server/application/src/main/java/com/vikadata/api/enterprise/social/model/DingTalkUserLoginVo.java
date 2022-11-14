package com.vikadata.api.enterprise.social.model;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.space.vo.SpaceVO;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * DingTalk User Login Request Parameters
 */
@ApiModel("DingTalk Application user login return information")
@Data
public class DingTalkUserLoginVo {

    @ApiModelProperty(value = "Space List", position = 1)
    private List<SpaceVO> spaces;

    @ApiModelProperty(value = "Number of activated members of the enterprise", position = 2)
    private Integer activeMemberCount;

    @ApiModelProperty(value = "Space ID bound by the application", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String bindSpaceId;
}
