package com.vikadata.api.space.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.enterprise.control.infrastructure.ExportLevelEnum;
import com.vikadata.api.space.ro.SpaceSecuritySettingRo;
import com.vikadata.api.shared.support.serializer.EmptyBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Space global feature
 * </p>
 *
 * The field must be consistent with the received parameters of the change interface
 * @see SpaceSecuritySettingRo SpaceSecuritySettingRo
 * @author Shawn Deng
 */
@Data
@ApiModel("Space Global Feature")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceGlobalFeature {

    @ApiModelProperty(value = "Whether file is allowed to be shared with others", example = "true", position = 1)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean fileSharable;

    @ApiModelProperty(value = "Whether space is allowed to invite others", example = "true", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean invitable;

    @ApiModelProperty(value = "Whether node is allowed to export", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeExportable;

    @ApiModelProperty(value = "Whether attachment is allowed to download", example = "true", position = 4)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean allowDownloadAttachment;

    @ApiModelProperty(value = "Whether data is allowed to copy", example = "true", position = 5)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean allowCopyDataToExternal;

    @ApiModelProperty(value = "Whether space is allowed others user join", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean joinable;

    @ApiModelProperty(value = "Whether social platform is allowed to integrate", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean socialOpen;

    @ApiModelProperty(value = "Whether member mobile is allowed to show", example = "false", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean mobileShowable;

    @ApiModelProperty(value = "Whether watermark is allowed to enable", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean watermarkEnable;

    @JsonIgnore
    @ApiModelProperty(hidden = true)
    private Boolean blackSpace;

    @JsonIgnore
    @ApiModelProperty(hidden = true)
    private Boolean ban;

    @ApiModelProperty(value = "certification level name", notes = "do not return without certification", example = "basic/senior", position = 11, hidden = true)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String certification;

    @ApiModelProperty(value = "Set permissions required to export files",
            notes = "0 forbidden/1 reader and above/2 editor and above/3 manager and above/4 updater and above",
            example = "2", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer exportLevel;

    @ApiModelProperty(value = "Whether organization isolate is open", example = "false", position = 13)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean orgIsolated;

    @ApiModelProperty(value = "Whether to forbid the management operations of members in the root directory", example = "false", position = 14)
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean rootManageable;

    public Integer exportLevelOrDefault() {
        if (exportLevel != null) {
            return exportLevel;
        }

        // Compatible with older versions
        return Boolean.TRUE.equals(nodeExportable)
                ? ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue()
                : ExportLevelEnum.LEVEL_CLOSED.getValue();
    }

    public Boolean rootManageableOrDefault() {
        return rootManageable != null ? rootManageable : true;
    }
}
