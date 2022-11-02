package com.vikadata.api.model.vo.censor;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
* <p>
* 内容安全-举报信息vo
* </p>
*
* @author Benson Cheung
* @date 2020/03/23
*/
@Data
@ApiModel("内容安全-举报信息vo")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ContentCensorResultVo {

    @NotBlank(message = "被举报的维格表ID")
    @ApiModelProperty(value = "被举报的维格表ID", example = "dstjuHFsxyvH6751p1", position = 1)
    private String nodeId;

    @NotBlank(message = "被举报的维格表名")
    @ApiModelProperty(value = "被举报的维格表名", example = "内涵表", position = 2)
    private String nodeName;

    @NotBlank(message = "被举报的维格表名")
    @ApiModelProperty(value = "被举报的维格表名", example = "内涵表", position = 3)
    private String shareId;

    @NotBlank(message = "处理结果，0 未处理，1 封禁，2 正常（解封）")
    @ApiModelProperty(value = "处理结果，0 未处理，1 封禁，2 正常（解封）", example = "1", position = 4)
    private Integer reportResult;

    @NotBlank(message = "被举报次数")
    @ApiModelProperty(value = "被举报次数", example = "666", position = 5)
    private int reportNum;

    @ApiModelProperty(value = "创建时间", example = "2020-03-18T15:29:59.000", position = 6)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "更新时间", example = "2020-03-18T15:29:59.000", position = 7)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updatedAt;

}
