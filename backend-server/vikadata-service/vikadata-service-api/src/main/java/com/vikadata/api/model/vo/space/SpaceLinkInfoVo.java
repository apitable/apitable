package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间公开邀请链接信息vo
 * </p>
 *
 * @author Chambers
 * @date 2020/3/23
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("空间公开邀请链接信息vo")
public class SpaceLinkInfoVo {

    @ApiModelProperty(value = "创建者名称", example = "某某", position = 1)
    private String memberName;

    @ApiModelProperty(value = "空间名称", example = "这是一个空间", position = 2)
    private String spaceName;

    @ApiModelProperty(value = "空间ID", example = "spc10", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceId;

    @ApiModelProperty(value = "是否在登录状态，未登陆", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isLogin;

    @ApiModelProperty(value = "是否已存在该空间中，已存在空间中直接调用切换空间接口", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isExist;

    @ApiModelProperty(value = "邀请者的个人邀请码", example = "vikatest", position = 6)
    private String inviteCode;
}
