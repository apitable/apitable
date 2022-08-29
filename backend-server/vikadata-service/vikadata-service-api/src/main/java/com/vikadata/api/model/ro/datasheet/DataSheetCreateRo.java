package com.vikadata.api.model.ro.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * 数表新建请求参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@ApiModel("数表新建请求参数")
public class DataSheetCreateRo {

	@ApiModelProperty(value = "数表节点Id",example = "nod16fq165m6c", position = 1)
	private String nodeId;

    @ApiModelProperty(value = "数表名称",example = "电商项目工作台", position = 2)
    private String name;

    @ApiModelProperty(value = "空间id",example = "spczJrh2i3tLW", position = 9)
    private String spaceId;

}
