package com.vikadata.api.lang;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.enums.lang.ExportLevelEnum;
import com.vikadata.api.support.serializer.EmptyBooleanSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 空间全局属性
 * </p>
 *
 * 字段需与变更接口的接收参数保持一致
 * @see com.vikadata.api.model.ro.space.SpaceSecuritySettingRo
 * @author Shawn Deng
 * @date 2020/3/7 15:57
 */
@Data
@ApiModel("空间全局属性")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceGlobalFeature {

    @ApiModelProperty(value = "允许分享文件", example = "true", position = 1)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean fileSharable;

    @ApiModelProperty(value = "全员可邀请状态", example = "true", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean invitable;

    @ApiModelProperty(value = "节点全员可导出状态", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeExportable;

    @ApiModelProperty(value = "允许只读成员下载附件", example = "true", position = 4)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean allowDownloadAttachment;

    @ApiModelProperty(value = "允许成员复制数据至站外", example = "true", position = 5)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean allowCopyDataToExternal;

    @ApiModelProperty(value = "允许他人申请加入空间状态", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean joinable;

    @ApiModelProperty(value = "是否开启第三方集成", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean socialOpen;

    @ApiModelProperty(value = "显示成员手机号", example = "false", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean mobileShowable;

    @ApiModelProperty(value = "全局水印开启状态", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean watermarkEnable;

    @ApiModelProperty(value = "空间站是否标记为黑名单", notes = "属性不在'space/features'接口返回", example = "false", position = 10, hidden = true)
    @JsonIgnore
    private Boolean blackSpace;

    @JsonIgnore
    private Boolean ban;

    @ApiModelProperty(value = "空间站认证", notes = "没有认证不返回", example = "basic/senior", position = 11, hidden = true)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String certification;

    /**
     * 取值查看 ExportLevelEnum
     *
     * @see ExportLevelEnum
     */
    @ApiModelProperty(value = "能够导出的成员权限等级",
            notes = "0 禁止导出或权限/1 只读及以上/2 可编辑以上/3 管理的成员/4 可更新及以上可以将目录中的维格表或视图导出到本地",
            example = "2", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer exportLevel;

    @ApiModelProperty(value = "是否开启通讯录隔离", example = "false", position = 13)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean orgIsolated;

    // 根目录操作权限控制
    @ApiModelProperty(value = "是否禁止普通成员根目录的「管理」操作", example = "false", position = 14)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean rootManageable;

    public Integer exportLevelOrDefault() {
        if (exportLevel != null) {
            return exportLevel;
        }

        // 兼容旧版本
        return Boolean.TRUE.equals(nodeExportable)
                ? ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue()
                : ExportLevelEnum.LEVEL_CLOSED.getValue();
    }

    public Boolean rootManageableOrDefault() {
        return rootManageable != null ? rootManageable : true;
    }
}
