package com.vikadata.api.model.vo.node;

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

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * 回收站节点信息视图
 * </p>
 *
 * @author Chambers
 * @date 2020/8/15
 */
@Data
@ApiModel("回收站节点信息视图")
@EqualsAndHashCode(callSuper = true)
public class RubbishNodeVo extends BaseNodeInfo {

    @ApiModelProperty(value = "空间ID", example = "spc09", position = 4)
    private String spaceId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "节点图标", example = ":smile", position = 4)
    private String icon;

    @ApiModelProperty(value = "删除者的用户uuid", dataType = "java.lang.String", example = "1", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "删除者成员名称", dataType = "java.lang.String", example = "李四", position = 5)
    private String memberName;

    @ApiModelProperty(value = "删除者头像", example = "public/2020/token", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 7)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 8)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "删除时间", example = "2019-01-01 10:12:13", position = 9)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime deletedAt;

    @ApiModelProperty(value = "删除路径", dataType = "java.lang.String", example = "A/B", position = 10)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String delPath;

    @ApiModelProperty(value = "剩余天数", example = "1", position = 11)
    private Integer remainDay;

    @JsonIgnore
    @ApiModelProperty(value = "保留天数", hidden = true)
    private Integer retainDay;

    public Integer getRemainDay() {
        return retainDay - (int) (LocalDate.now(ZoneId.of("+8")).toEpochDay() - deletedAt.toLocalDate().toEpochDay());
    }
}
