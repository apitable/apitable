package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 主管理员信息vo
 * </p>
 *
 * @author Chambers
 * @date 2020/2/17
 */
@Data
@ApiModel("主管理员信息vo")
public class MainAdminInfoVo {

	@ApiModelProperty(value = "姓名", example = "张三", position = 1)
	private String name;

	@JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
	@ApiModelProperty(value = "头像地址", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
	private String avatar;

	@ApiModelProperty(value = "职位", example = "经理", position = 3)
	private String position;

    @ApiModelProperty(value = "手机区号", example = "+1", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String areaCode;

	@ApiModelProperty(value = "手机号码", example = "13610102020", position = 4)
	private String mobile;

	@ApiModelProperty(value = "电子邮箱", example = "example@qq.com", position = 5)
	private String email;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 6)
    private Boolean isMemberNameModified;

}
