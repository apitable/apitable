package com.vikadata.api.enterprise.censor.vo;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;

/**
* <p>
* Content security - report information vo
* </p>
*/
@Data
@ApiModel("Content security - report information vo")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ContentCensorResultVo {

    @NotBlank(message = "Reported vika ID")
    @ApiModelProperty(value = "Reported vika ID", example = "dstjuHFsxyvH6751p1", position = 1)
    private String nodeId;

    @NotBlank(message = "The name of the reported vika table")
    @ApiModelProperty(value = "The name of the reported vika table", example = "Connotation table", position = 2)
    private String nodeName;

    @NotBlank(message = "The name of the reported vika table")
    @ApiModelProperty(value = "The name of the reported vika table", example = "Connotation table", position = 3)
    private String shareId;

    @NotBlank(message = "Processing result: 0 not processed, 1 banned, 2 normal (unsealed)")
    @ApiModelProperty(value = "Processing result: 0 not processed, 1 banned, 2 normal (unsealed)", example = "1", position = 4)
    private Integer reportResult;

    @NotBlank(message = "Times of being reported")
    @ApiModelProperty(value = "Times of being reported", example = "666", position = 5)
    private int reportNum;

    @ApiModelProperty(value = "Creation time", example = "2020-03-18T15:29:59.000", position = 6)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Update time", example = "2020-03-18T15:29:59.000", position = 7)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updatedAt;

}
