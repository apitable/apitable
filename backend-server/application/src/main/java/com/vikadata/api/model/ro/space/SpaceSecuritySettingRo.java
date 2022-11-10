package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.validator.ExportLevelMatch;

/**
 * <p>
 * Space Management - Permission and Security Settings Request Parameters
 * </p>
 *
 * @see com.vikadata.api.lang.SpaceGlobalFeature
 */
@Data
@ApiModel("Space Management - Permission and Security Settings Request Parameters")
public class SpaceSecuritySettingRo {

    // Allow file sharing (default)
    @ApiModelProperty(value = "Allow file share", example = "true", position = 1)
    private Boolean fileSharable;

    // Allow non administrators to invite members (allowed by default)
    @ApiModelProperty(value = "Invitable status of all staff", example = "true", position = 2)
    private Boolean invitable;

    // Allow to apply for joining the space station (not allowed by default)
    @ApiModelProperty(value = "Allow others to apply for space status", example = "false", position = 3)
    private Boolean joinable;

    // Allow to export the vika (allowed by default)
    @ApiModelProperty(value = "All members of the node can be exported", example = "true", position = 4)
    @Deprecated
    private Boolean nodeExportable;

    // Allow read-only roles to download attachments (allowed by default)
    @ApiModelProperty(value = "Allow read-only members to download attachments", example = "true", position = 5)
    private Boolean allowDownloadAttachment;

    // Allow data replication offsite (default)
    @ApiModelProperty(value = "Allow members to copy data offsite", example = "true", position = 6)
    private Boolean allowCopyDataToExternal;

    // Display member mobile number (not displayed by default)
    @ApiModelProperty(value = "Display member's mobile number", example = "false", position = 7)
    private Boolean mobileShowable;

    // Global watermark on status (not displayed by default)
    @ApiModelProperty(value = "Global Watermark On Status", example = "false", position = 8)
    private Boolean watermarkEnable;

    // blackSpace The attribute is not mapped and is operated by GM

    // Permissions to export a vika
    @ApiModelProperty(value = "Member permission levels that can be exported",
            notes = "0 Prohibit export or permission 1 Read only and above/ 2 Editable above/3 The managed members can export the table or view in the directory to the local",
            example = "2", position = 9)
    @ExportLevelMatch
    private Integer exportLevel;

    // Address book isolation (not enabled by default)
    @ApiModelProperty(value = "Address book isolation", example = "false", position = 10)
    private Boolean orgIsolated;

    // Root directory operation permission control
    @ApiModelProperty(value = "Whether to disable the 「management」 operation of the root directory of ordinary members", example = "false", position = 11)
    private Boolean rootManageable;
}
