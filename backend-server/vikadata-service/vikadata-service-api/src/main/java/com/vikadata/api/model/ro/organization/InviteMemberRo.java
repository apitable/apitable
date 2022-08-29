package com.vikadata.api.model.ro.organization;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * 邀请成员参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/11 10:23
 */
@Data
@ApiModel("邀请成员参数")
public class InviteMemberRo {

    @ApiModelProperty(value = "邮箱地址,严格校验", example = "123456@qq.com", required = true, position = 1)
    @Pattern(regexp = PatternConstants.EMAIL, message = "邮箱格式不正确", flags = Flag.CASE_INSENSITIVE)
    private String email;

    @ApiModelProperty(value = "分配部门ID,可选,如果不传递，则默认加入空间的根部门下面", dataType = "java.lang.String", example = "16272126", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @ApiModelProperty(value = "分配部门名称，可选，同teamId对应，teamId不传递，teamName也可以为空", example = "技术部", position = 3)
    private String teamName;
}
