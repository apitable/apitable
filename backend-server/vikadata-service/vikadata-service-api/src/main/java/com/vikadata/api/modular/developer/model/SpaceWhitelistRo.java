package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * <p>
 * 空间白名单参数
 * </p>
 *
 * @author Chambers
 * @date 2020/12/19
 */
@Data
@ApiModel("空间白名单参数")
public class SpaceWhitelistRo {

    @ApiModelProperty(value = "空间ID 列表", required = true, example = "[\"spczJrh2i3tLW\",\"spczdmQDfBAn5\"]", position = 1)
    @NotEmpty(message = "空间ID 不能为空")
    private List<String> spaceIds;

    @ApiModelProperty(value = "成员数量", example = "100", position = 2)
    private Integer memberCount;

    @ApiModelProperty(value = "空间容量倍数(*1G)", example = "10", position = 3)
    private Long capacityMultiple;

    @ApiModelProperty(value = "空间文件节点数量", example = "10", position = 4)
    private Integer fileCount;

    @ApiModelProperty(value = "空间子管理员数量", example = "9", position = 5)
    private Integer subAdminCount;

    @ApiModelProperty(value = "有效天数", example = "9", position = 5)
    private Integer day;
}
