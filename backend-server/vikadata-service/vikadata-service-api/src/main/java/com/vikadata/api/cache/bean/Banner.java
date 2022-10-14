package com.vikadata.api.cache.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Recommend Top Banner View
 * </p>
 *
 * @author Chambers
 * @date 2020/7/4
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Banner View")
public class Banner {

    @ApiModelProperty(value = "Template ID", example = "tplumddN5Cs5p", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String templateId;

    @ApiModelProperty(value = "Banner Image", example = "https://xxx.com/cover001.jpg", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String image;

    @ApiModelProperty(value = "Title", example = "OKR Tracking", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String title;

    @ApiModelProperty(value = "Description", example = "It is an useful tool to keep tracking everyone's OKRs on your team.", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String desc;

    @ApiModelProperty(value = "Font Color", example = "#000000", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String color;
}
