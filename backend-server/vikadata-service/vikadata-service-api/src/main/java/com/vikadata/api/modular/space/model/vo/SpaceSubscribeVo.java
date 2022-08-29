package com.vikadata.api.modular.space.model.vo;

import java.time.LocalDate;
import java.util.List;

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * <p>
 * 空间的订阅信息
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@ApiModel("空间的订阅信息")
public class SpaceSubscribeVo {

    @ApiModelProperty(value = "版本", example = "V1", position = 1)
    private String version;

    @ApiModelProperty(value = "基础订阅产品名称", example = "Bronze", position = 2)
    private String product;

    @ApiModelProperty(value = "是否正在试用期", example = "false", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean onTrial;

    @ApiModelProperty(value = "基础订阅计划名称", example = "bronze_no_billing_period", position = 3)
    private String plan;

    @ApiModelProperty(value = "增值计划名称列表", dataType = "List", example = "[\"space_capacity_50G_v1\",\"api_usage_20000_v1\"]", position = 5)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> addOnPlans;

    @ApiModelProperty(value = "订阅到期时间, 免费则为空", example = "2019-01-01", position = 6)
    @JsonFormat(pattern = DatePattern.NORM_DATE_PATTERN)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate deadline;

    @ApiModelProperty(value = "席位(单位: 个)", example = "10", position = 7)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxSeats;

    @ApiModelProperty(value = "容量(单位: 兆)", example = "10", position = 8)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCapacitySizeInBytes;

    @ApiModelProperty(value = "表数量(单位: 个)", example = "10", position = 9)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxSheetNums;

    @ApiModelProperty(value = "单个表最大记录(单位: 行)", example = "10", position = 10)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsPerSheet;

    @ApiModelProperty(value = "总记录数(单位: 行)", example = "10", position = 11)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsInSpace;

    @ApiModelProperty(value = "API用量限制(单位: 次)", example = "10", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxApiCall;

    @ApiModelProperty(value = "管理员数量(单位: 个)", example = "10", position = 13)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAdminNums;

    @ApiModelProperty(value = "回收站保存天数(单位: 天)", example = "10", position = 14)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainTrashDays;

    @ApiModelProperty(value = "最大相册视图数量(单位: 个)", example = "10", position = 15)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGalleryViewsInSpace;

    @ApiModelProperty(value = "最大看板视图数量(单位: 个)", example = "10", position = 16)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxKanbanViewsInSpace;

    @ApiModelProperty(value = "最大神奇表单数量(单位: 个)", example = "10", position = 17)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxFormViewsInSpace;

    @ApiModelProperty(value = "最大甘特视图数量(单位: 个)", example = "10", position = 18)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGanttViewsInSpace;

    @ApiModelProperty(value = "最大日历视图数量(单位: 个)", example = "10", position = 19)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCalendarViewsInSpace;

    @ApiModelProperty(value = "最大可设置列权限数量(单位: 个)", example = "10", position = 20)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fieldPermissionNums;

    @ApiModelProperty(value = "最大可设置文件权限数量(单位: 个)", example = "10", position = 20)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long nodePermissionNums;

    @ApiModelProperty(value = "每个表时光机保留天数(单位: 天)", example = "10", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainTimeMachineDays;

    @ApiModelProperty(value = "钉钉集成功能是否拥有", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationDingtalk;

    @ApiModelProperty(value = "飞书集成功能是否拥有", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationFeishu;

    @ApiModelProperty(value = "企业微信集成功能是否拥有", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationWeCom;

    @ApiModelProperty(value = "office预览集成功能是否拥有", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationOfficePreview;

    @ApiModelProperty(value = "彩虹标签功能是否拥有", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rainbowLabel;

    @ApiModelProperty(value = "全局水印功能是否拥有", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean watermark;

    @ApiModelProperty(value = "每个表动态保留天数(单位: 天)", example = "14", position = 13)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainRecordActivityDays;

    @ApiModelProperty(value = "空间站是否标记为黑名单", position = 14)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean blackSpace;

    @ApiModelProperty(value = "安全设置-普通成员进行邀请操作", example = "false", position = 15)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingInviteMember;

    @ApiModelProperty(value = "安全设置-站外用户申请加入空间站", example = "false", position = 16)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingApplyJoinSpace;

    @ApiModelProperty(value = "安全设置-创建公开链接", example = "false", position = 17)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingShare;

    @ApiModelProperty(value = "安全设置-导出维格表和视图", example = "false", position = 18)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingExport;

    @ApiModelProperty(value = "安全设置-只读用户下载附件", example = "false", position = 19)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingDownloadFile;

    @ApiModelProperty(value = "安全设置-只读用户将数据复制到站外", example = "false", position = 20)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingCopyCellData;

    @ApiModelProperty(value = "安全设置-显示成员手机号", example = "false", position = 21)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingMobile;

    @ApiModelProperty(value = "审计日志最大可查询天数(单位: 天)", example = "14", position = 22)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAuditQueryDays;

    @ApiModelProperty(value = "赠送的未过期容量(单位：byte)", dataType = "java.lang.String", example = "1024", position = 23)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long unExpireGiftCapacity;

    @ApiModelProperty(value = "套餐容量(单位：byte)", dataType = "java.lang.String", example = "1024", position = 24)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long subscriptionCapacity;
}
