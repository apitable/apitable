package com.vikadata.api.cache.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * <p>
 * 模板中心 - 热门推荐配置
 * </p>
 *
 * @author Chambers
 * @date 2020/7/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendConfig {

    /**
     * 顶部轮播图
     */
    List<Banner> top;

    /**
     * 自定义分组
     */
    List<CategoryDto> categories;
}
