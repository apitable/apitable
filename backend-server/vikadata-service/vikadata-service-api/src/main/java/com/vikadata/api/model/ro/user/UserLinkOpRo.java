package com.vikadata.api.model.ro.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 帐号关联请求参数
 * </p>
 *
 * @author Chamebrs
 * @date 2020/3/5
 */
@Data
@ApiModel("帐号关联请求参数")
public class UserLinkOpRo {

    @NotNull(message = "第三方类型不能为空")
    @ApiModelProperty(value = "第三方类型(0.钉钉;1.微信;2.QQ)", example = "1", position = 1, required = true)
    private Integer type;
}
