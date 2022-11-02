package com.vikadata.api.model.vo.wechat;

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
 * 微信登陆结果vo
 * </p>
 *
 * @author Chambers
 * @date 2020/2/24
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("微信登陆结果vo")
public class LoginResultVo {

    @Builder.Default
    @ApiModelProperty(value = "是否已绑定维格账号", example = "false", position = 1)
    private Boolean isBind = false;

    @Builder.Default
    @ApiModelProperty(value = "是否需要创建空间，标识用户没有任何空间关联，作为创建空间引导的标准字段", example = "false", position = 2)
    private Boolean needCreate = true;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "昵称", example = "张三，内容为空时需要进入设置昵称页面", position = 3)
    private String nickName;

    @ApiModelProperty(value = "是否是新注册用户", hidden = true)
    private boolean newUser;

    @ApiModelProperty(value = "新注册的用户表ID", hidden = true)
    private Long userId;

    @ApiModelProperty(value = "是否已存在union_id", example = "false", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasUnion;
}
