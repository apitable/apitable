package com.vikadata.scheduler.space.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CategoryDto
 *
 * @author Zoe Zheng
 * @date 2021-08-10 17:04:23
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class CategoryDto {
    /**
     * 分类code
     */
    private String categoryCode;

    /**
     * 分类名称
     */
    private String categoryName;

    /**
     * 分类下的模板
     */
    private List<String> templateIds;
}
