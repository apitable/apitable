package com.vikadata.api.model.vo.template;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * <p>
 * 模板中心 - 热门推荐自定义分组视图
 * </p>
 *
 * @author Chambers
 * @date 2020/7/9
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("热门推荐自定义分组视图")
public class CustomCategoryVo {

    @ApiModelProperty(value = "自定义分组名称", example = "居家办公百宝箱", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryName;

    @ApiModelProperty(value = "分类下的模板", position = 2)
    private List<TemplateVo> templateVos;
}
