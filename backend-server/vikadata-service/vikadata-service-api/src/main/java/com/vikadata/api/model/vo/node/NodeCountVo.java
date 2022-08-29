package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 节点数量vo
 * </p>
 *
 * @author Chambers
 * @date 2020/1/10
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("节点数量vo")
public class NodeCountVo {

    @ApiModelProperty(value = "文件夹数量", example = "5", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer folderNumber;

    @ApiModelProperty(value = "文件数量", example = "20", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer fileNumber;

}
