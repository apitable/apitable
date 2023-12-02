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
 * Template Property Service.
 * </p>
 */
public interface ITemplatePropertyService extends IService<TemplatePropertyEntity> {

    /**
     * Get template category entity by name.
     *
     * @param name category name
     */
    TemplatePropertyEntity getTemplateCategoryByName(String name);

    /**
     * Get template category entity.
     *
     * @param propertyCode property code
     */
    TemplatePropertyEntity getTemplateCategory(String propertyCode);

    /**
     * Get template category code.
     *
     * @param lang locale
     */
    List<String> getTemplateCategoryCodeByLang(String lang);

    /**
     * Get the basic information of the online template after sorting.
     *
     * @param type property type
     * @param lang locale
     */
    List<TemplatePropertyDto> getTemplatePropertiesWithLangAndOrder(TemplatePropertyType type,
                                                                    String lang);

    /**
     * Get template id list by property code and type.
     *
     * @param code property code
     * @param type property type
     */
    List<String> getTemplateIdsByPropertyCodeAndType(String code, TemplatePropertyType type);

    /**
     * Get property by template id list.
     *
     * @param templateIds template id list
     * @param type        property type
     */
    List<TemplatePropertyRelDto> getPropertyByTemplateIds(List<String> templateIds,
                                                          TemplatePropertyType type);

    /**
     * Get template tag map by template id list.
     *
     * @param templateIds template id list
     */
    Map<String, List<String>> getTemplatesTags(List<String> templateIds);

    /**
     * Search template.
     *
     * @param keyWord search word
     * @param lang    locale
     */
    LinkedHashSet<String> getTemplateIdsByKeyWordAndLang(String keyWord, String lang);

    /**
     * If there is no classification configuration in a language, return default value(like "zh_CN"), if there is, return the original value.
     *
     * @param lang locale
     */
    String ifNotCategoryReturnDefaultElseRaw(String lang);

    /**
     * Get official template category list.
     *
     * @param lang locale
     */
    List<CategoryDto> getCategories(String lang);
}
