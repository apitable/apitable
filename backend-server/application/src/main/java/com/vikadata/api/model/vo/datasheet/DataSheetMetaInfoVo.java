package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * Result view of data table and meta information
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@ApiModel("Result view of data table and meta information")
public class DataSheetMetaInfoVo {


    @ApiModelProperty(value = "Number table name",example = "E-commerce project workbench", position = 2)
    private String name;

    @ApiModelProperty(value = "Number table custom ID", position = 3)
    private String id;

    @ApiModelProperty(value = "Version No",example = "0", position = 4)
    private Long revision;

    @ApiModelProperty(value = "Owner user Id", position = 7)
    private Long ownerId;

    @ApiModelProperty(value = "Creator user Id", position = 8)
    private Long creatorId;

    @ApiModelProperty(value = "Space id", position = 9)
    private String spaceId;

    @ApiModelProperty(value = "Data table meta set", position = 10)
    private JSONObject meta;

	@ApiModelProperty(value = "Node Information and Permission", position = 11)
	private NodeInfoVo nodeInfo;
}
