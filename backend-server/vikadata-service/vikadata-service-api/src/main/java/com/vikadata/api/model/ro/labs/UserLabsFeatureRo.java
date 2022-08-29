package com.vikadata.api.model.ro.labs;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 此处写注释
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/27 17:34:48
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("实验室功能设置 请求对象")
public class UserLabsFeatureRo {

    @ApiModelProperty(value = "空间站ID，留空则标识设置用户级别功能", dataType = "java.lang.String", example = "spc6e2CeZLBFN", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "需要操作的实验室功能唯一标识", dataType = "java.lang.String", example = "render_prompt", position = 2)
    private String key;

    @ApiModelProperty(value = "是否开启", dataType = "java.lang.Boolean", example = "true", position = 3)
    private Boolean isEnabled;
}
