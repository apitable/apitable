package com.vikadata.api.template.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.vika.core.VikaOperations;
import com.apitable.starter.vika.core.model.OnlineTemplateInfo;
import com.vikadata.api.shared.cache.bean.CategoryDto;
import com.vikadata.api.shared.component.LanguageManager;
import com.vikadata.api.template.enums.TemplatePropertyType;
import com.vikadata.api.template.mapper.TemplatePropertyMapper;
import com.vikadata.api.template.mapper.TemplatePropertyRelMapper;
import com.vikadata.api.template.model.TemplateKeyWordSearchDto;
import com.vikadata.api.template.model.TemplatePropertyDto;
import com.vikadata.api.template.model.TemplatePropertyRelDto;
import com.vikadata.api.template.service.ITemplatePropertyService;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.TemplatePropertyEntity;
import com.vikadata.entity.TemplatePropertyRelEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Template Property Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class TemplatePropertyServiceImpl extends ServiceImpl<TemplatePropertyMapper, TemplatePropertyEntity> implements ITemplatePropertyService {

    @Resource
    private TemplatePropertyRelMapper propertyRelMapper;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private TemplatePropertyRelMapper templatePropertyRelMapper;

    @Override
    public List<TemplatePropertyDto> getTemplatePropertiesWithLangAndOrder(TemplatePropertyType type, String rawLang) {
        String lang = ifNotCategoryReturnDefaultElseRaw(rawLang);
        return baseMapper.selectTemplatePropertiesWithLangAndOrder(type.getType(), lang);
    }

    /**
     * Follow the configuration update processing of the previous version of the shelf template:
     * * 1. Only read the old configuration information of a certain language into a container
     * * 2. The container updates the old data and adds new configuration information
     * * 3. Delete the old configuration of this language in the database
     * * 4. Then write the updated data and new data into the database
     * The idea of compatibility with previous iterations is to use lang to isolate data.
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void configOnlineTemplate(String nodeId, Map<String, String> nameToTplIdMap, Long operatorUserId, String lang, List<String> templateCategoryNames) {
        // Get config info
        List<OnlineTemplateInfo> templateConfigList = vikaOperations.getOnlineTemplateConfiguration(nodeId, lang);

        // Context during update object
        TemplatePropertyMeta propertyMeta = new TemplatePropertyMeta();
        propertyMeta.operateUserId = operatorUserId;
        propertyMeta.lang = lang;
        // Get a sorted collection of taxonomy names
        propertyMeta.categoryNames = templateCategoryNames;
        // Use lang to read old configuration information.
        getOldPropertyTableOfSpecifiedLanguage(propertyMeta);

        // update old data
        for (OnlineTemplateInfo templateInfo : templateConfigList) {
            String templateName = templateInfo.getTemplateName();
            String templateId = nameToTplIdMap.get(templateName);
            if (templateId == null) {
                throw new BusinessException("Template name 「{}」 is incorrect." + templateName);
            }
            // Handling template category attributes
            handleTemplateProperty(nameToTplIdMap.get(templateName), propertyMeta,
                    Arrays.asList(templateInfo.getTemplateCategoryName()), TemplatePropertyType.CATEGORY);
            if (templateInfo.getTemplateTagName() != null) {
                // Handling template tag attributes
                handleTemplateProperty(nameToTplIdMap.get(templateName), propertyMeta,
                        Arrays.asList(templateInfo.getTemplateTagName()), TemplatePropertyType.TAG);
            }

        }
        // Delete the old configuration of this language in the database
        propertyMeta.doDelete();
        // write new data to the database
        propertyMeta.doSaveOrUpdate();
    }

    @Override
    public Long getIdByCodeAndType(String code, TemplatePropertyType propertyType) {
        return baseMapper.selectIdByCodeAndType(code, propertyType.getType());
    }

    @Override
    public List<String> getTemplateIdsByPropertyCodeAndType(String code, TemplatePropertyType type) {
        Long propertyId = getIdByCodeAndType(code, type);
        if (propertyId != null) {
            return propertyRelMapper.selectTemplateIdsByPropertyId(propertyId);
        }
        return Collections.emptyList();
    }

    @Override
    public List<TemplatePropertyRelDto> getPropertyByTemplateIds(List<String> templateIds, TemplatePropertyType type) {
        return baseMapper.selectPropertiesByTemplateIdsAndType(templateIds, type.getType());
    }

    @Override
    public Map<String, List<String>> getTemplatesTags(List<String> templateIds) {
        List<TemplatePropertyRelDto> dtos = getPropertyByTemplateIds(templateIds, TemplatePropertyType.TAG);
        return dtos.stream().collect(Collectors.groupingBy(TemplatePropertyRelDto::getTemplateId,
                Collectors.mapping(TemplatePropertyRelDto::getPropertyName, Collectors.toList())));
    }

    @Override
    public LinkedHashSet<String> getTemplateIdsByKeyWordAndLang(String propertyName, String lang) {
        // When queried, property_type=0 means that only the template name matches
        List<TemplateKeyWordSearchDto> searchDtoList = baseMapper.selectTemplateByPropertyNameAndLang(propertyName, lang);
        int listSize = searchDtoList.size();
        // Divide into three groups, name+tag, name, tag contain keywords respectively, and ensure the order of template ID
        LinkedHashSet<String> nameLikeTemplateIds = new LinkedHashSet<>(listSize);
        LinkedHashSet<String> nameAndLikeTemplateIds = new LinkedHashSet<>(listSize);
        LinkedHashSet<String> tagLikeTemplateIds = new LinkedHashSet<>(listSize);
        searchDtoList.forEach(item -> {
            if (item.getPropertyType().equals(TemplatePropertyType.CATEGORY.getType())) {
                nameLikeTemplateIds.add(item.getTemplateId());
            }
            else if (item.getNameIndex() > 0 && item.getPropertyNameIndex() > 0) {
                // Both names and tags can match keywords
                nameAndLikeTemplateIds.add(item.getTemplateId());
            }
            else {
                tagLikeTemplateIds.add(item.getTemplateId());
            }
        });
        // Guaranteed order
        nameAndLikeTemplateIds.addAll(nameLikeTemplateIds);
        nameAndLikeTemplateIds.addAll(tagLikeTemplateIds);
        return nameAndLikeTemplateIds;
    }

    @Override
    public String ifNotCategoryReturnDefaultElseRaw(String lang) {

        if (LanguageManager.me().getDefaultLanguageTagWithUnderLine().equals(lang)) {
            return lang;
        }

        int count = baseMapper.countByI18n(lang);
        if (count > 0) {
            return lang;
        }

        return LanguageManager.me().getDefaultLanguageTagWithUnderLine();
    }

    @Override
    public List<CategoryDto> getCategories(String lang) {
        List<TemplatePropertyDto> properties = baseMapper
                .selectTemplatePropertiesWithLangAndOrder(TemplatePropertyType.CATEGORY.getType(), lang);
        if (CollUtil.isEmpty(properties)) {
            return CollUtil.newArrayList();
        }
        List<String> propertyCodes = properties.stream().map(TemplatePropertyDto::getPropertyCode).collect(Collectors.toList());
        List<TemplatePropertyRelDto> templatePropertyRelList = templatePropertyRelMapper.selectTemplateIdsByPropertyIds(propertyCodes);
        Map<String, List<String>> propertyCode2TemplateId = templatePropertyRelList.stream()
                .collect(Collectors.groupingBy(TemplatePropertyRelDto::getPropertyCode,
                        Collectors.mapping(TemplatePropertyRelDto::getTemplateId, Collectors.toList())));
        List<CategoryDto> categories = new ArrayList<>(properties.size());
        properties.forEach(property -> {
            CategoryDto category = new CategoryDto();
            category.setCategoryName(property.getPropertyName());
            category.setCategoryCode(property.getPropertyCode());
            category.setTemplateIds(propertyCode2TemplateId.get(property.getPropertyCode()));
            categories.add(category);
        });
        return categories;
    }

    private void handleTemplateProperty(String templateId, TemplatePropertyMeta propertyMeta,
            List<String> propertyNames, TemplatePropertyType propertyType) {
        for (int i = 0; i < propertyNames.size(); i++) {
            Long propertyId;
            String propertyName = propertyNames.get(i);
            if (propertyType.equals(TemplatePropertyType.TAG)) {
                propertyId = handleTemplateTagProperty(propertyMeta, propertyName);
            }
            else {
                propertyId = handleTemplateCategoryProperty(propertyMeta, propertyName);
            }
            // Handling many-to-many associations
            TemplatePropertyRelEntity relEntity = new TemplatePropertyRelEntity();
            relEntity.setPropertyId(propertyId);
            relEntity.setTemplateId(templateId);
            relEntity.setId(IdWorker.getId());
            Integer order = propertyMeta.categoryNames.contains(propertyName) ?
                    propertyMeta.categoryNames.indexOf(propertyName) : i;
            relEntity.setPropertyOrder(order);
            relEntity.setPropertyCode(propertyMeta.propertyIdToPropertyCode.get(propertyId));
            propertyMeta.templatePropertyRelEntities.add(relEntity);
        }

    }

    private Long handleTemplateCategoryProperty(TemplatePropertyMeta propertyMeta, String categoryName) {
        if (!propertyMeta.categoryNameMap.containsKey(categoryName)) {
            TemplatePropertyEntity propertyEntity = new TemplatePropertyEntity();
            // properties have been saved
            if (propertyMeta.templateCategoryMap.containsKey(categoryName)) {
                TemplatePropertyDto dto = propertyMeta.templateCategoryMap.get(categoryName);
                propertyEntity.setId(dto.getPropertyId());
                propertyEntity.setUpdatedBy(propertyMeta.operateUserId);
                propertyEntity.setPropertyCode(dto.getPropertyCode());
                propertyMeta.updateTemplatePropertyEntities.add(propertyEntity);
            }
            else {
                // It has not been written before, and the newly added category needs to be written to the database
                Long propertyId = IdWorker.getId();
                propertyEntity.setId(propertyId);
                propertyEntity.setPropertyName(categoryName);
                propertyEntity.setPropertyCode(IdUtil.createTempCatCode());
                propertyEntity.setPropertyType(TemplatePropertyType.CATEGORY.getType());
                propertyEntity.setI18nName(propertyMeta.lang);
                propertyEntity.setCreatedBy(propertyMeta.operateUserId);
                propertyMeta.templatePropertyEntities.add(propertyEntity);
            }
            propertyMeta.propertyIdToPropertyCode.put(propertyEntity.getId(), propertyEntity.getPropertyCode());
            propertyMeta.categoryNameMap.put(categoryName, propertyEntity.getId());
            propertyMeta.newPropertyIds.add(propertyEntity.getId());
            return propertyEntity.getId();
        }
        return propertyMeta.categoryNameMap.get(categoryName);
    }


    private Long handleTemplateTagProperty(TemplatePropertyMeta propertyMeta, String tagName) {
        TemplatePropertyEntity propertyEntity = new TemplatePropertyEntity();
        // did not operate
        if (!propertyMeta.tagNameMap.containsKey(tagName)) {
            if (propertyMeta.templateTagMap.containsKey(tagName)) {
                TemplatePropertyDto dto = propertyMeta.templateTagMap.get(tagName);
                propertyEntity.setId(dto.getPropertyId());
                propertyEntity.setUpdatedBy(propertyMeta.operateUserId);
                propertyEntity.setPropertyCode(dto.getPropertyCode());
                propertyMeta.updateTemplatePropertyEntities.add(propertyEntity);
            }
            else {
                // It has not been written before, and the newly added category needs to be written to the database
                Long propertyId = IdWorker.getId();
                propertyEntity.setId(propertyId);
                propertyEntity.setPropertyName(tagName);
                propertyEntity.setPropertyCode(IdUtil.createTempTagCode());
                propertyEntity.setPropertyType(TemplatePropertyType.TAG.getType());
                propertyEntity.setCreatedBy(propertyMeta.operateUserId);
                propertyEntity.setI18nName(propertyMeta.lang);
                propertyMeta.templatePropertyEntities.add(propertyEntity);
            }
            propertyMeta.propertyIdToPropertyCode.put(propertyEntity.getId(), propertyEntity.getPropertyCode());
            propertyMeta.tagNameMap.put(tagName, propertyEntity.getId());
            propertyMeta.newPropertyIds.add(propertyEntity.getId());
            return propertyEntity.getId();
        }
        return propertyMeta.tagNameMap.get(tagName);
    }

    class TemplatePropertyMeta {
        Long operateUserId;

        String lang;

        List<String> categoryNames;

        // old data storage container
        Map<String, TemplatePropertyDto> templateCategoryMap;

        Map<String, TemplatePropertyDto> templateTagMap;

        List<TemplatePropertyEntity> templatePropertyEntities = new ArrayList<>();

        List<Long> oldPropertyIds;

        // Update or new data storage container
        List<TemplatePropertyEntity> updateTemplatePropertyEntities = new ArrayList<>();

        List<TemplatePropertyRelEntity> templatePropertyRelEntities = new ArrayList<>();

        List<Long> newPropertyIds = new ArrayList<>();

        Map<String, Long> tagNameMap = new HashMap<>();

        Map<String, Long> categoryNameMap = new HashMap<>();

        Map<Long, String> propertyIdToPropertyCode = new HashMap<>();

        void doSaveOrUpdate() {
            if (!templatePropertyRelEntities.isEmpty()) {
                propertyRelMapper.insertBatch(templatePropertyRelEntities);
            }
            if (!templatePropertyEntities.isEmpty()) {
                baseMapper.insertBatch(templatePropertyEntities);
            }
            if (!updateTemplatePropertyEntities.isEmpty()) {
                updateBatchById(updateTemplatePropertyEntities);
            }
        }

        void doDelete() {

            // Delete the previous relationship and rewrite
            if (CollUtil.isNotEmpty(oldPropertyIds)) {
                // Delete the old relationship for this language configuration
                propertyRelMapper.deleteBatchIn(oldPropertyIds);
            }

            // Calculate removeIds
            Set<Long> newPropertyIds = new HashSet<>(this.newPropertyIds);
            // intersection newMemberIds
            newPropertyIds.retainAll(oldPropertyIds);
            // have intersection
            if (!newPropertyIds.isEmpty()) {
                // difference of oldMemberIds and intersection
                oldPropertyIds.removeAll(newPropertyIds);
            }
            if (!oldPropertyIds.isEmpty()) {
                baseMapper.deleteBatchByIds(oldPropertyIds, operateUserId);
            }
        }

    }

    /**
     * Read old configuration information for a language
     * @param meta Context during the listing template configuration update process
     */
    private void getOldPropertyTableOfSpecifiedLanguage(TemplatePropertyMeta meta) {
        // generate propertyName -> list<TemplatePropertyDto>
        List<TemplatePropertyDto> templateProperties = baseMapper.selectTemplatePropertiesWithI18n(meta.lang);
        Map<String, TemplatePropertyDto> categoryMap = new HashMap<>(templateProperties.size());
        Map<String, TemplatePropertyDto> tagMap = new HashMap<>(templateProperties.size());
        List<Long> oldPropertyIds = new ArrayList<>(templateProperties.size());
        templateProperties.forEach(item -> {
            if (item.getPropertyType().equals(TemplatePropertyType.TAG.getType())) {
                tagMap.put(item.getPropertyName(), item);
            }
            else if (item.getPropertyType().equals(TemplatePropertyType.CATEGORY.getType())) {
                categoryMap.put(item.getPropertyName(), item);
            }
            oldPropertyIds.add(item.getPropertyId());
        });
        // The tag may have the same name as the category
        // categoryName -> templateProperty
        meta.templateCategoryMap = categoryMap;
        // tagName -> templateProperty
        meta.templateTagMap = tagMap;
        // old templateProperty table id
        meta.oldPropertyIds = oldPropertyIds;
    }
}
