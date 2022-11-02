package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 组织单元请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/20 10:50
 */
@Data
@ApiModel("组织单元请求参数")
public class OrgUnitRo {

    @ApiModelProperty(value = "ID", dataType = "java.lang.String", required = true, example = "120322719823", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long id;

    @NotNull
    @ApiModelProperty(value = "分类，只能接收指定类型，1=部门，2=成员", required = true, example = "1", position = 2)
    private Integer type;
}
