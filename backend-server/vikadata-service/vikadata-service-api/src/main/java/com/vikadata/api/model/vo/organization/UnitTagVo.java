package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 标签单位视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/21 01:29
 */
@Data
@ApiModel("标签单位视图")
public class UnitTagVo {

	@ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", example = "1", position = 1)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long unitId;

	@ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 2)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long tagId;

	@ApiModelProperty(value = "部门名称", example = "研发部 ｜ 张三", position = 3)
	private String tagName;

	@ApiModelProperty(value = "部门简称", example = "研", position = 4)
	private String shortName;

	@ApiModelProperty(value = "成员数量", example = "3", position = 5)
	private Integer memberCount;
}
