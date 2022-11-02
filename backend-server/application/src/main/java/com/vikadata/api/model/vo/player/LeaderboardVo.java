package com.vikadata.api.model.vo.player;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NicknameEncryptSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p> 
 * 排行榜信息
 * </p> 
 *
 * @author Chambers
 * @date 2021/5/31
 */
@Data
@ApiModel("排行榜信息")
public class LeaderboardVo {

    @ApiModelProperty(value = "头像", example = "null", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "用户昵称", example = "余**", position = 1)
    @JsonSerialize(using = NicknameEncryptSerializer.class)
    private String nickname;

    @ApiModelProperty(value = "邀请总数", example = "35", position = 2)
    private Integer count;
}
