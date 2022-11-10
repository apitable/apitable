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
 * Number of nodes vo
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Number of nodes vo")
public class NodeCountVo {

    @ApiModelProperty(value = "Number of folders", example = "5", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer folderNumber;

    @ApiModelProperty(value = "Number of documents", example = "20", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer fileNumber;

}
