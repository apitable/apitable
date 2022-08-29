package com.vikadata.api.cache.bean;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 模板中心 - 官方分类 / 热门推荐自定义分组
 * </p>
 *
 * @author Chambers
 * @date 2020/7/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TemplateCacheDto {

    /**
     * 分类dto
     */
    private List<CategoryDto> categories;

    /**
     * 标签dto
     */
    private List<TemplateTagDto> tags;
}
