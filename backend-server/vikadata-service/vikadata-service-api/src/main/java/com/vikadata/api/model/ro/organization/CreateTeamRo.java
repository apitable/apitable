package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * <p>
 * 新增部门请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/26 18:30
 */
@Data
@ApiModel("新增部门请求参数")
public class CreateTeamRo {

    @NotBlank
    @Size(min = 1, max = 100, message = "部门名称不能超过100个字符")
    @ApiModelProperty(value = "部门名称", required = true, example = "财务部", position = 1)
    private String name;

    @NotNull
    @ApiModelProperty(value = "父级ID,如果父级是根,则为0", dataType = "java.lang.String", example = "0", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long superId;
}
