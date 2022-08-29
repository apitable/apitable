package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * 调整成员部门请求参数
 *
 * @author Chambers
 * @since 2019/10/23
 */
@Data
@ApiModel("调整成员部门请求参数")
public class UpdateMemberTeamRo {

    @NotEmpty
    @ApiModelProperty(value = "成员ID", required = true, dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 1)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberIds;

    @ApiModelProperty(value = "原部门ID列表,允许为空，如果是为空，则代表是根部门", dataType = "java.lang.String", example = "271632", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long preTeamId;

    @NotEmpty
    @ApiModelProperty(value = "调整后的部门ID列表", required = true, dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 3)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> newTeamIds;
}
