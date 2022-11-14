package com.vikadata.api.template.vo;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.vikadata.api.shared.support.serializer.NullArraySerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Template Album Content View
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("Template Album Content View")
public class AlbumContentVo extends AlbumVo {

    @ApiModelProperty(value = "Albums Content", example = "This is the content about album.", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String content;

    @ApiModelProperty(value = "Author Name", dataType = "java.lang.String", example = "1", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String authorName;

    @ApiModelProperty(value = "Author Logo", example = "https://xxx.com/avator001.jpg", position = 7)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String authorLogo;

    @ApiModelProperty(value = "Author Description", example = "This is a description about author.", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String authorDesc;

    @ApiModelProperty(value = "Template Tag List", example = "[\"aaa\", \"bbb\"]", position = 9)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> tags;

    @ApiModelProperty(value = "creation time millisecond timestamp", dataType = "java.lang.Long", example = "1573561644000", position = 10)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class, nullsUsing = NullNumberSerializer.class)
    private LocalDateTime createdAt;

}
