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
 * Leaderboard information
 * </p>
 */
@Data
@ApiModel("Leaderboard information")
public class LeaderboardVo {

    @ApiModelProperty(value = "Head portrait", example = "null", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "User nickname", example = "Zhang San", position = 1)
    @JsonSerialize(using = NicknameEncryptSerializer.class)
    private String nickname;

    @ApiModelProperty(value = "Total invitations", example = "35", position = 2)
    private Integer count;
}
