package com.vikadata.api.model.ro.space;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 空间加入申请处理的请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/10/29
 */
@Data
@ApiModel("空间加入申请处理的请求参数")
public class SpaceJoinProcessRo {

    @ApiModelProperty(value = "通知ID", dataType = "java.lang.String", required = true, example = "761263712638")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    @NotNull(message = "通知ID不能为空")
    private Long notifyId;

    @ApiModelProperty(value = "是否同意", dataType = "java.lang.Boolean", required = true, example = "true")
    @NotNull(message = "是否同意不能为空")
    private Boolean agree;
}
