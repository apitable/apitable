package com.vikadata.api.model.vo.space;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.LocalDateTimeToMilliSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 仪表盘空间信息vo
 * </p>
 *
 * @author Chambers
 * @date 2019/11/29
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("仪表盘空间信息vo")
public class SpaceInfoVO {

    @ApiModelProperty(value = "空间名称", example = "我的工作空间", position = 1)
    private String spaceName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "空间logo", example = "http://...", position = 2)
    private String spaceLogo;

    @ApiModelProperty(value = "创建者名称", example = "张三", position = 3)
    private String creatorName;

    @ApiModelProperty(value = "成员（creator）是否修改过昵称", notes = "目前只适用企微isv用来判断显示名称的控件", position = 4)
    private Boolean isCreatorNameModified;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "创建者头像", example = "http://...", position = 4)
    private String creatorAvatar;

    @ApiModelProperty(value = "空间拥有者名称", example = "李四", position = 5)
    private String ownerName;

    @ApiModelProperty(value = "成员（owner）是否修改过昵称", notes = "目前只适用企微isv用来判断显示名称的控件", position = 5)
    private Boolean isOwnerNameModified;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "空间拥有者头像", example = "http://...", position = 6)
    private String ownerAvatar;

    @ApiModelProperty(value = "创建时间时间戳(毫秒)", example = "1573561644000", position = 7)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class, nullsUsing = NullNumberSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "正式删除时间戳(毫秒)", example = "1573561644000", position = 8)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class, nullsUsing = NullNumberSerializer.class)
    private LocalDateTime delTime;

    @ApiModelProperty(value = "第三方集成绑定信息", position = 9)
    private SpaceSocialConfig social;

    @ApiModelProperty(value = "部门数量", example = "5", position = 10)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long deptNumber;

    @ApiModelProperty(value = "席位数", example = "5", position = 11)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long seats;

    @ApiModelProperty(value = "表数量", example = "5", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long sheetNums;

    @ApiModelProperty(value = "空间所有表总行数", example = "5", position = 13)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long recordNums;

    @ApiModelProperty(value = "空间管理员数量", example = "5", position = 14)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long adminNums;

    @ApiModelProperty(value = "已用附件容量(单位：字节)", example = "1024", position = 15)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long capacityUsedSizes;

    @ApiModelProperty(value = "API调用累计用量", example = "10", position = 16)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiRequestCountUsage;

    @ApiModelProperty(value = "字段权限设置总数", example = "10", position = 17)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fieldRoleNums;

    @ApiModelProperty(value = "文件权限设置总数", example = "10", position = 17)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long nodeRoleNums;

    @ApiModelProperty(value = "看板视图总数", example = "10", position = 18)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long kanbanViewNums;

    @ApiModelProperty(value = "相册视图总数", example = "10", position = 19)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long galleryViewNums;

    @ApiModelProperty(value = "甘特视图总数", example = "10", position = 20)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long ganttViewNums;

    @ApiModelProperty(value = "日历视图总数", example = "10", position = 21)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long calendarViewNums;

    @ApiModelProperty(value = "表单视图总数", example = "10", position = 22)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long formViewNums;

    @ApiModelProperty(value = "已用当前套餐附件容量(单位：字节)", example = "1024", position = 23)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long currentBundleCapacityUsedSizes;

    @ApiModelProperty(value = "已用赠送附件容量(单位：字节)", example = "1024", position = 24)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long giftCapacityUsedSizes;
}
