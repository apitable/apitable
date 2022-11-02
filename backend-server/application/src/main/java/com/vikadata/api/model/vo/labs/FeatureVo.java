package com.vikadata.api.model.vo.labs;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 内测功能状态 值对象
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/26 16:28:38
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("内测功能状态")
public class FeatureVo {

    @ApiModelProperty(value = "实验室功能唯一标识", dataType = "java.lang.String", example = "robot", position = 1)
    private String key;

    @ApiModelProperty(value = "实验室功能类别", dataType = "java.lang.String", example = "review", position = 2)
    private String type;

    @ApiModelProperty(value = "实验室功能申请内测表单url", dataType = "java.lang.String", position = 3)
    private String url;

    @ApiModelProperty(value = "实验室功能开启状态", dataType = "java.lang.Boolean", example = "true", position = 4)
    private Boolean open;
}
