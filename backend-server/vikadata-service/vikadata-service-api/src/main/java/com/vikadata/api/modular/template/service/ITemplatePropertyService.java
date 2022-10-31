package com.vikadata.api.modular.template.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.cache.bean.CategoryDto;
import com.vikadata.api.enums.template.TemplatePropertyType;
import com.vikadata.api.modular.template.model.TemplatePropertyDto;
import com.vikadata.api.modular.template.model.TemplatePropertyRelDto;
import com.vikadata.entity.TemplatePropertyEntity;

/**
 * <p>
 * Template Property Service
 * </p>
 */
public interface ITemplatePropertyService extends IService<TemplatePropertyEntity> {

    /**
     * Get the basic information of the online template after sorting
     */
    List<TemplatePropertyDto> getTemplatePropertiesWithLangAndOrder(TemplatePropertyType type, String lang);

    /**
     * Configure template properties
     */
    void configOnlineTemplate(String nodeId, Map<String, String> nameToTplIdMap, Long operatorUserId, String lang, List<String> templateCategoryNames);

    /**
     * Get property id by property code and type
     */
    Long getIdByCodeAndType(String code, TemplatePropertyType type);

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
