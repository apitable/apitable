package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 空间管理 - 普通成员设置 请求参数
 * </p>
 *
 * 状态字段与读库序列化对象保持一致
 * @see com.vikadata.api.lang.SpaceGlobalFeature
 * @author Chambers
 * @date 2021/4/8
 */
@Data
@ApiModel("空间管理 - 普通成员设置 请求参数")
public class SpaceMemberSettingRo {

    @ApiModelProperty(value = "全员可邀请状态", example = "true", position = 1)
    private Boolean invitable;

    @ApiModelProperty(value = "允许他人申请加入空间状态", example = "false", position = 2)
    private Boolean joinable;

    @ApiModelProperty(value = "显示成员手机号", example = "false", position = 3)
    private Boolean mobileShowable;

}
