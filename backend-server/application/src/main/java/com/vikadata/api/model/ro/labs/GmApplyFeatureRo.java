package com.vikadata.api.model.ro.labs;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 申请开启实验性内测功能 请求对象
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/27 01:01:05
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("申请开启实验性内测功能请求对象")
public class GmApplyFeatureRo {

    @ApiModelProperty(value = "待开启实验性功能的空间站ID，可选，允许为空", dataType = "java.lang.String", example = "spchhRu3xQqt9", position = 1)
    private String spaceId;

    @NotBlank(message = "申请者用户不允许为空")
    @ApiModelProperty(value = "申请开通实验性功能的用户ID", dataType = "java.lang.String", required = true, example = "a83ec20f15c9459893d133c2c369eff6", position = 2)
    private String applyUserId;

    @NotBlank(message = "实验室功能标识不能为空")
    @ApiModelProperty(value = "实验性功能唯一标识", dataType = "java.lang.String", required = true, example = "render_prompt|async_compute|robot|widget_center", position = 3)
    private String featureKey;

    @ApiModelProperty(value = "是否开启", dataType = "java.lang.Boolean", required = true, example = "true", position = 4)
    private Boolean enable;
}
