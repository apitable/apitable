package com.vikadata.api.model.ro.space;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * <p>
 * 更新管理员请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/12 23:58
 */
@ApiModel("更新管理员请求参数")
@Data
public class UpdateSpaceRoleRo {

	@NotNull(message = "ID不能为空")
	@ApiModelProperty(value = "角色ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long id;

	@NotNull(message = "选择成员不能为空")
	@ApiModelProperty(value = "选择成员ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long memberId;

	@NotEmpty(message = "分配权限不能为空")
	@ApiModelProperty(value = "操作资源集合，不分排序，自动校验", dataType = "List", required = true, example = "[\"MANAGE_TEAM\",\"MANAGE_MEMBER\"]", position = 2)
	private List<String> resourceCodes;
}
