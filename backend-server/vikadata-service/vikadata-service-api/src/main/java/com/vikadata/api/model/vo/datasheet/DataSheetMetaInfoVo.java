package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * 数表与Meta信息的结果视图
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@ApiModel("数表与Meta信息的结果视图")
public class DataSheetMetaInfoVo {


    @ApiModelProperty(value = "数表名称",example = "电商项目工作台", position = 2)
    private String name;

    @ApiModelProperty(value = "数表自定义ID", position = 3)
    private String id;

    @ApiModelProperty(value = "版本号",example = "0", position = 4)
    private Long revision;

    @ApiModelProperty(value = "拥有者userId", position = 7)
    private Long ownerId;

    @ApiModelProperty(value = "创建者userId", position = 8)
    private Long creatorId;

    @ApiModelProperty(value = "空间id", position = 9)
    private String spaceId;

    @ApiModelProperty(value = "数表meta集合", position = 10)
    private JSONObject meta;

	@ApiModelProperty(value = "节点信息与权限", position = 11)
	private NodeInfoVo nodeInfo;
}
