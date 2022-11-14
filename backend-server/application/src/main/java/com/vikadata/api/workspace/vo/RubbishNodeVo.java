package com.vikadata.api.workspace.vo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

import static com.vikadata.api.shared.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * Recycle Bin Node Information View
 * </p>
 */
@Data
@ApiModel("Recycle Bin Node Information View")
@EqualsAndHashCode(callSuper = true)
public class RubbishNodeVo extends BaseNodeInfo {

    @ApiModelProperty(value = "Space ID", example = "spc09", position = 4)
    private String spaceId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Node icon", example = ":smile", position = 4)
    private String icon;

    @ApiModelProperty(value = "User uuid of the deleted user", dataType = "java.lang.String", example = "1", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Deleted by Member Name", dataType = "java.lang.String", example = "Li Si", position = 5)
    private String memberName;

    @ApiModelProperty(value = "Remover's avatar", example = "public/2020/token", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 7)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 8)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "Delete time", example = "2019-01-01 10:12:13", position = 9)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime deletedAt;

    @ApiModelProperty(value = "Delete Path", dataType = "java.lang.String", example = "A/B", position = 10)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String delPath;

    @ApiModelProperty(value = "Days Remain", example = "1", position = 11)
    private Integer remainDay;

    @JsonIgnore
    @ApiModelProperty(value = "Retention days", hidden = true)
    private Integer retainDay;

    public Integer getRemainDay() {
        return retainDay - (int) (LocalDate.now(ZoneId.of("+8")).toEpochDay() - deletedAt.toLocalDate().toEpochDay());
    }
}
