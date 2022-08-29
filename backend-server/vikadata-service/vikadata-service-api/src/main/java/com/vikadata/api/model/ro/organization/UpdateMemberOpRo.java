package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * <p>
 * 编辑自己成员信息请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/12
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("编辑自己成员信息请求参数")
public class UpdateMemberOpRo {

    @ApiModelProperty(value = "成员姓名", example = "张三", position = 3)
    @NotBlank(message = "不能为空")
    @Size(max = 32, message = "长度不能超过32位")
    private String memberName;
}
