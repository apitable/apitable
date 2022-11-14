package com.vikadata.api.shared.cache.bean;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * template category
 * </p>
 *
 * @author Chambers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class CategoryDto {

    private String categoryCode;

    private String categoryName;

    private List<String> templateIds;

    public CategoryDto(String categoryName, List<String> templateIds) {
        this.categoryName = categoryName;
        this.templateIds = templateIds;
    }
}
