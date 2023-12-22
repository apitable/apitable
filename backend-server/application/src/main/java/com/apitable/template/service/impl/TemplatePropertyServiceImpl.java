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

package com.apitable.template.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.apitable.shared.cache.bean.CategoryDto;
import com.apitable.shared.component.LanguageManager;
import com.apitable.template.entity.TemplatePropertyEntity;
import com.apitable.template.enums.TemplatePropertyType;
import com.apitable.template.mapper.TemplatePropertyMapper;
import com.apitable.template.mapper.TemplatePropertyRelMapper;
import com.apitable.template.model.TemplateKeyWordSearchDto;
import com.apitable.template.model.TemplatePropertyDto;
import com.apitable.template.model.TemplatePropertyRelDto;
import com.apitable.template.service.ITemplatePropertyService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Template Property Service Implement Class.
 * </p>
 */
@Slf4j
@Service
public class TemplatePropertyServiceImpl
    extends ServiceImpl<TemplatePropertyMapper, TemplatePropertyEntity>
    implements ITemplatePropertyService {

    @Resource
    private TemplatePropertyRelMapper propertyRelMapper;

    @Override
    public TemplatePropertyEntity getTemplateCategoryByName(String name) {
        return baseMapper.selectByPropertyTypeAndPropertyName(
            TemplatePropertyType.CATEGORY.getType(), name);
    }

    @Override
    public TemplatePropertyEntity getTemplateCategory(String propertyCode) {
        return baseMapper.selectByPropertyCodeAndPropertyType(propertyCode,
            TemplatePropertyType.CATEGORY.getType());
    }

    @Override
    public List<String> getTemplateCategoryCodeByLang(String lang) {
        return baseMapper.selectPropertyCodeByPropertyTypeAndI18nName(
            TemplatePropertyType.CATEGORY.getType(), lang);
    }

    @Override
    public List<TemplatePropertyDto> getTemplatePropertiesWithLangAndOrder(
        TemplatePropertyType type, String rawLang) {
        String lang = ifNotCategoryReturnDefaultElseRaw(rawLang);
        return baseMapper.selectTemplatePropertiesWithLangAndOrder(type.getType(), lang);
    }

    @Override
    public List<String> getTemplateIdsByPropertyCodeAndType(String code,
                                                            TemplatePropertyType type) {
        return propertyRelMapper.selectTemplateIdsByPropertyCode(code);
    }

    @Override
    public List<TemplatePropertyRelDto> getPropertyByTemplateIds(List<String> templateIds,
                                                                 TemplatePropertyType type) {
        return baseMapper.selectPropertiesByTemplateIdsAndType(templateIds, type.getType());
    }

    @Override
    public Map<String, List<String>> getTemplatesTags(List<String> templateIds) {
        List<TemplatePropertyRelDto> dtos =
            getPropertyByTemplateIds(templateIds, TemplatePropertyType.TAG);
        return dtos.stream().collect(Collectors.groupingBy(TemplatePropertyRelDto::getTemplateId,
            Collectors.mapping(TemplatePropertyRelDto::getPropertyName, Collectors.toList())));
    }

    @Override
    public LinkedHashSet<String> getTemplateIdsByKeyWordAndLang(String propertyName, String lang) {
        // When queried, property_type=0 means that only the template name matches
        List<TemplateKeyWordSearchDto> searchDtoList =
            baseMapper.selectTemplateByPropertyNameAndLang(propertyName, lang);
        int listSize = searchDtoList.size();
        // Divide into three groups, name+tag, name, tag contain keywords respectively,
        // and ensure the order of template ID
        LinkedHashSet<String> nameLikeTemplateIds = new LinkedHashSet<>(listSize);
        LinkedHashSet<String> nameAndLikeTemplateIds = new LinkedHashSet<>(listSize);
        LinkedHashSet<String> tagLikeTemplateIds = new LinkedHashSet<>(listSize);
        searchDtoList.forEach(item -> {
            if (item.getPropertyType().equals(TemplatePropertyType.CATEGORY.getType())) {
                nameLikeTemplateIds.add(item.getTemplateId());
            } else if (item.getNameIndex() > 0 && item.getPropertyNameIndex() > 0) {
                // Both names and tags can match keywords
                nameAndLikeTemplateIds.add(item.getTemplateId());
            } else {
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
        int type = TemplatePropertyType.CATEGORY.getType();
        List<TemplatePropertyDto> properties =
            baseMapper.selectTemplatePropertiesWithLangAndOrder(type, lang);
        if (CollUtil.isEmpty(properties)) {
            return CollUtil.newArrayList();
        }
        List<String> propertyCodes = properties.stream()
            .map(TemplatePropertyDto::getPropertyCode)
            .collect(Collectors.toList());
        List<TemplatePropertyRelDto> templatePropertyRelList =
            propertyRelMapper.selectTemplateIdsByPropertyIds(propertyCodes);
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
}
