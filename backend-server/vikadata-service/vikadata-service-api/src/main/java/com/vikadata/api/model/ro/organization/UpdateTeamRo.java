package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 部门修改请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/10 11:48
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("修改部门信息请求参数")
public class UpdateTeamRo {

    @NotNull
    @ApiModelProperty(value = "部门ID", required = true, dataType = "java.lang.String", example = "1", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @ApiModelProperty(value = "部门名称", dataType = "string", example = "设计部", position = 2)
    private String teamName;

    @ApiModelProperty(value = "父级ID,如果父级是根,则为0", required = true, dataType = "java.lang.String", example = "0", position = 3)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long superId;
}
