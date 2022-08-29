package com.vikadata.api.modular.developer.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * DevelopUserVo
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/6/22 16:29
 */
@Data
@ApiModel("空间列表信息")
public class SpaceShowcaseVo {

    @ApiModelProperty(value = "空间ID", example = "小明", position = 1, required = true)
    private String spaceId;

    @ApiModelProperty(value = "空间名称", example = "小明", position = 2, required = true)
    private String spaceName;

    @ApiModelProperty(value = "创建时间", example = "小明", position = 3, required = true)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;
}
