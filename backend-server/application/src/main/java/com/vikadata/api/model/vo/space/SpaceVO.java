package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * 空间视图
 *
 * @author Chambers
 * @since 2019/10/9
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("空间列表视图")
public class SpaceVO {

    @ApiModelProperty(value = "空间ID", example = "spc10", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "名称", example = "这是一个空间", position = 2)
    private String name;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "图标", example = "https://...", position = 3)
    private String logo;

    @ApiModelProperty(value = "是否有红点", example = "false", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean point;

    @ApiModelProperty(value = "是否是空间主管理员", example = "false", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean admin;

    @ApiModelProperty(value = "是否是付费空间", example = "false", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean charge;

    @ApiModelProperty(value = "是否处于预删除状态", example = "false", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean preDeleted;

    @ApiModelProperty(value = "订阅计划最大成员总数", position = 8)
    private Long maxSeat;

    @ApiModelProperty(value = "空间站域名", position = 9)
    private String spaceDomain;

    @Deprecated
    @ApiModelProperty(value = "第三方集成绑定信息", position = 10)
    private SpaceSocialConfig social;
}
