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
 * 轮播图信息
 * </p>
 *
 * @author Chambers
 * @date 2020/7/4
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("轮播图信息")
public class Banner {

    @ApiModelProperty(value = "模板ID", example = "tplumddN5Cs5p", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String templateId;

    @ApiModelProperty(value = "描述", example = "https://s1.vika.cn/default/cover001.jpg", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String image;

    @ApiModelProperty(value = "标题", example = "漫威爱好者，有种你进来", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String title;

    @ApiModelProperty(value = "描述", example = "我上看下看，左看右看，原来每个视图都不简单", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String desc;

    @ApiModelProperty(value = "模版名字颜色", example = "#000000", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String color;
}
