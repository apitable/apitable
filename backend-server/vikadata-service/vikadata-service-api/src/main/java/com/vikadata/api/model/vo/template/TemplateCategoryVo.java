package com.vikadata.api.model.vo.template;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 模版分类视图
 * </p>
 *
 * @author Chambers
 * @date 2020/6/2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("模版分类视图")
public class TemplateCategoryVo {

    @ApiModelProperty(value = "模板分类code", example = "tpcCq88sqNqEv", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryCode;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "模板分类名称", example = "电视剧", position = 2)
    private String categoryName;
}
