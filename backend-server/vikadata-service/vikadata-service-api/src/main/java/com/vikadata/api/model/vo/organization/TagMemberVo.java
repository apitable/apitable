package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 标签的成员列表视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("标签的成员列表视图")
public class TagMemberVo {

    @ApiModelProperty(value = "成员ID", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "成员姓名", example = "张三", position = 2)
    private String memberName;

    @ApiModelProperty(value = "工号", example = "000101", position = 3)
    private String jobNumber;

    @ApiModelProperty(value = "手机号码", example = "13610102020", position = 4)
    private String mobile;

    @ApiModelProperty(value = "电子邮箱", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "所属部门", example = "设计部,测试部,开发部", position = 6)
    private String depts;
}
