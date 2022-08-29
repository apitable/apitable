package com.vikadata.api.model.vo.developer;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 开发者配置信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 15:40
 */
@Data
@ApiModel("开发者配置信息视图")
public class DeveloperInfoVo {

    @ApiModelProperty(value = "访问令牌", example = "张三", position = 1)
    private String apiKey;
}
