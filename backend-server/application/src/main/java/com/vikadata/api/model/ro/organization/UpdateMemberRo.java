package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <p>
 * 编辑成员信息请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/20 10:50
 */
@Data
@ApiModel("编辑成员信息请求参数")
public class UpdateMemberRo {

	@NotNull
	@ApiModelProperty(value = "成员ID", required = true, dataType = "java.lang.String", example = "1", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long memberId;

	@ApiModelProperty(value = "成员姓名", example = "张三", position = 3)
    @Size(max = 32, message = "长度不能超过32位")
	private String memberName;

	@ApiModelProperty(value = "职位", example = "经理", position = 4)
	private String position;

	@ApiModelProperty(value = "电子邮箱", example = "example@qq.com", position = 5)
	private String email;

	@Size(max = 60, message = "工号不能大于60个字符")
	@ApiModelProperty(value = "工号", example = "\"143613308\"", position = 6)
	private String jobNumber;

	@ApiModelProperty(value = "归属部门ID", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 7)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> teamIds;

	@ApiModelProperty(value = "归属标签ID集合", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 8)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> tagIds;
}
