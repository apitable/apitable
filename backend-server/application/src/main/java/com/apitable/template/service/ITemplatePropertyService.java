/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.template.service;

import com.apitable.shared.cache.bean.CategoryDto;
import com.apitable.template.entity.TemplatePropertyEntity;
import com.apitable.template.enums.TemplatePropertyType;
import com.apitable.template.model.TemplatePropertyDto;
import com.apitable.template.model.TemplatePropertyRelDto;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * Template Property Service
 * </p>
 */
public interface ITemplatePropertyService extends IService<TemplatePropertyEntity> {

    /**
     * Get template category entity by name.
     */
    TemplatePropertyEntity getTemplateCategoryByName(String name);

    /**
     * Get template category entity.
     */
    TemplatePropertyEntity getTemplateCategory(String propertyCode);

    /**
     * Get template category code.
     */
    List<String> getTemplateCategoryCodeByLang(String lang);

    /**
     * Get the basic information of the online template after sorting
     */
    List<TemplatePropertyDto> getTemplatePropertiesWithLangAndOrder(TemplatePropertyType type, String lang);

    /**
     * Get template id list by property code and type
     */
    List<String> getTemplateIdsByPropertyCodeAndType(String code, TemplatePropertyType type);

    /**
     * Get property by template id list
     */
    List<TemplatePropertyRelDto> getPropertyByTemplateIds(List<String> templateIds, TemplatePropertyType type);

    /**
     * Get template tag map by template id list
     */
    Map<String, List<String>> getTemplatesTags(List<String> templateIds);

    /**
     * Search template
     */
    LinkedHashSet<String> getTemplateIdsByKeyWordAndLang(String keyWord, String lang);

    /**
     * If there is no classification configuration in a language, return default value(like "zh_CN"), if there is, return the original value
     */
    String ifNotCategoryReturnDefaultElseRaw(String lang);

    /**
     * Get official template category list
     */
    List<CategoryDto> getCategories(String lang);
}
