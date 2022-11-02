package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.validator.ExportLevelMatch;

/**
 * <p>
 * 空间管理 - 权限与安全设置 请求参数
 * </p>
 *
 * @see com.vikadata.api.lang.SpaceGlobalFeature
 * @author 胡海平(Humphrey Hu)
 * @date 2021/9/28 18:59:36
 */
@Data
@ApiModel("空间管理 - 权限与安全设置 请求参数")
public class SpaceSecuritySettingRo {

    // 允许分享文件（默认允许）
    @ApiModelProperty(value = "允许分享文件", example = "true", position = 1)
    private Boolean fileSharable;

    // 允许非管理员邀请成员（默认允许）
    @ApiModelProperty(value = "全员可邀请状态", example = "true", position = 2)
    private Boolean invitable;

    // 允许申请加入空间站（默认不允许）
    @ApiModelProperty(value = "允许他人申请加入空间状态", example = "false", position = 3)
    private Boolean joinable;

    // 允许导出维格表（默认允许）
    @ApiModelProperty(value = "节点全员可导出状态", example = "true", position = 4)
    @Deprecated
    private Boolean nodeExportable;

    // 允许只读角色下载附件（默认允许）
    @ApiModelProperty(value = "允许只读成员下载附件", example = "true", position = 5)
    private Boolean allowDownloadAttachment;

    // 允许将数据复制到站外（默认允许）
    @ApiModelProperty(value = "允许成员复制数据至站外", example = "true", position = 6)
    private Boolean allowCopyDataToExternal;

    // 显示成员手机号（默认不显示）
    @ApiModelProperty(value = "显示成员手机号", example = "false", position = 7)
    private Boolean mobileShowable;

    // 全局水印开启状态（默认不显示）
    @ApiModelProperty(value = "全局水印开启状态", example = "false", position = 8)
    private Boolean watermarkEnable;

    // blackSpace 属性不做映射，该属性是GM来操作的

    // 能够导出维格表的权限
    @ApiModelProperty(value = "能够导出的成员权限等级",
            notes = "0 禁止导出或权限1 只读及以上/ 2 可编辑以上/3 管理的成员可以将目录中的维格表或视图导出到本地",
            example = "2", position = 9)
    @ExportLevelMatch
    private Integer exportLevel;

    // 通讯录隔离（默认不开启）
    @ApiModelProperty(value = "通讯录隔离", example = "false", position = 10)
    private Boolean orgIsolated;

    // 根目录操作权限控制
    @ApiModelProperty(value = "是否禁止普通成员根目录的「管理」操作", example = "false", position = 11)
    private Boolean rootManageable;
}
