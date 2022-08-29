package com.vikadata.api.modular.template.service.impl;

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

import com.vikadata.api.cache.bean.CategoryDto;
import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.enums.template.TemplatePropertyType;
import com.vikadata.api.modular.template.mapper.TemplatePropertyMapper;
import com.vikadata.api.modular.template.mapper.TemplatePropertyRelMapper;
import com.vikadata.api.modular.template.model.TemplateKeyWordSearchDto;
import com.vikadata.api.modular.template.model.TemplatePropertyDto;
import com.vikadata.api.modular.template.model.TemplatePropertyRelDto;
import com.vikadata.api.modular.template.service.ITemplatePropertyService;
import com.vikadata.api.modular.workspace.service.IDatasheetMetaService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.TemplatePropertyEntity;
import com.vikadata.entity.TemplatePropertyRelEntity;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.OnlineTemplateInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 模板中心-模版属性 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/12
 */
@Slf4j
@Service
public class TemplatePropertyServiceImpl extends ServiceImpl<TemplatePropertyMapper, TemplatePropertyEntity> implements ITemplatePropertyService {
    @Resource
    private TemplatePropertyRelMapper propertyRelMapper;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private IDatasheetMetaService datasheetMetaService;

    @Resource
    private TemplatePropertyRelMapper templatePropertyRelMapper;

    @Override
    public List<TemplatePropertyDto> getTemplatePropertiesWithLangAndOrder(TemplatePropertyType type, String rawLang) {
        String lang = ifNotCategoryReturnDefaultElseRaw(rawLang);
        return baseMapper.selectTemplatePropertiesWithLangAndOrder(type.getType(), lang);
    }

    /**
     *
     * 沿用之前版本上架模板的配置更新处理：
     *    1. 只读取某语言的旧配置信息到某容器中
     *    2. 容器对旧数据进行更新，并添加新配置信息
     *    3. 删除此语言在数据库中的旧配置
     *    4. 而后将更新数据和新数据写入数据库中
     * 兼容之前的迭代版本的思路是利用lang对数据进行隔离。
     *
     * @param nodeId 模版配置表ID
     * @param nameToTplIdMap 模版名字ID对应的map
     * @param operatorUserId 操作用户ID
     * @param lang 语言
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void configOnlineTemplate(String nodeId, Map<String, String> nameToTplIdMap, Long operatorUserId, String lang, List<String> templateCategoryNames) {
        // 请求【维格表API】获取上架模板配置表
        List<OnlineTemplateInfo> templateConfigList = vikaOperations.getOnlineTemplateConfiguration(nodeId, lang);

        // 更新过程中的上下文
        TemplatePropertyMeta propertyMeta = new TemplatePropertyMeta();
        propertyMeta.operateUserId = operatorUserId;
        propertyMeta.lang = lang;
        // 获取排序的分类名称集合
        propertyMeta.categoryNames = templateCategoryNames;
        // 利用lang，读取旧配置信息。
        getOldPropertyTableOfSpecifiedLanguage(propertyMeta);

        // 对旧数据进行更新
        for (OnlineTemplateInfo templateInfo : templateConfigList) {
            String templateName = templateInfo.getTemplateName();
            String templateId = nameToTplIdMap.get(templateName);
            if (templateId == null) {
                throw new BusinessException("模版名称不正确:" + templateName);
            }
            // 处理模版分类属性
            handleTemplateProperty(nameToTplIdMap.get(templateName), propertyMeta,
                    Arrays.asList(templateInfo.getTemplateCategoryName()), TemplatePropertyType.CATEGORY);
            if (templateInfo.getTemplateTagName() != null) {
                // 处理模版标签属性
                handleTemplateProperty(nameToTplIdMap.get(templateName), propertyMeta,
                        Arrays.asList(templateInfo.getTemplateTagName()), TemplatePropertyType.TAG);
            }

        }
        // 删除此语言在数据库中的旧配置
        propertyMeta.doDelete();
        // 将新数据写入数据库中
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
        // 查询出来的时候，property_type=0 表示只有模版名字匹配
        List<TemplateKeyWordSearchDto> searchDtoList = baseMapper.selectTemplateByPropertyNameAndLang(propertyName, lang);
        int listSize = searchDtoList.size();
        // 分成三组，名字+tag，名字，tag 分别包含关键字，并且保证模版ID的顺序
        LinkedHashSet<String> nameLikeTemplateIds = new LinkedHashSet<>(listSize);
        LinkedHashSet<String> nameAndLikeTemplateIds = new LinkedHashSet<>(listSize);
        LinkedHashSet<String> tagLikeTemplateIds = new LinkedHashSet<>(listSize);
        searchDtoList.forEach(item -> {
            if (item.getPropertyType().equals(TemplatePropertyType.CATEGORY.getType())) {
                nameLikeTemplateIds.add(item.getTemplateId());
            }
            else if (item.getNameIndex() > 0 && item.getPropertyNameIndex() > 0) {
                // 名字和tag都能和关键字匹配
                nameAndLikeTemplateIds.add(item.getTemplateId());
            }
            else {
                tagLikeTemplateIds.add(item.getTemplateId());
            }
        });
        // 保证顺序
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
            // 处理多对多关联
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
            // 已经保存了属性
            if (propertyMeta.templateCategoryMap.containsKey(categoryName)) {
                TemplatePropertyDto dto = propertyMeta.templateCategoryMap.get(categoryName);
                propertyEntity.setId(dto.getPropertyId());
                propertyEntity.setUpdatedBy(propertyMeta.operateUserId);
                propertyEntity.setPropertyCode(dto.getPropertyCode());
                propertyMeta.updateTemplatePropertyEntities.add(propertyEntity);
            }
            else {
                // 之前没有写入，新增的分类，需要写入数据库
                Long propertyId = IdWorker.getId();
                propertyEntity.setId(propertyId);
                propertyEntity.setPropertyName(categoryName);
                propertyEntity.setPropertyCode(IdUtil.createTempCatCode());
                propertyEntity.setPropertyType(TemplatePropertyType.CATEGORY.getType());
                propertyEntity.setI18nName(propertyMeta.lang);
                propertyEntity.setCreatedBy(propertyMeta.operateUserId);
                // 新增
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
        // 没有操作过
        if (!propertyMeta.tagNameMap.containsKey(tagName)) {
            if (propertyMeta.templateTagMap.containsKey(tagName)) {
                TemplatePropertyDto dto = propertyMeta.templateTagMap.get(tagName);
                propertyEntity.setId(dto.getPropertyId());
                propertyEntity.setUpdatedBy(propertyMeta.operateUserId);
                propertyEntity.setPropertyCode(dto.getPropertyCode());
                propertyMeta.updateTemplatePropertyEntities.add(propertyEntity);
            }
            else {
                // 之前没有写入，新增的分类，需要写入数据库
                Long propertyId = IdWorker.getId();
                propertyEntity.setId(propertyId);
                propertyEntity.setPropertyName(tagName);
                propertyEntity.setPropertyCode(IdUtil.createTempTagCode());
                propertyEntity.setPropertyType(TemplatePropertyType.TAG.getType());
                propertyEntity.setCreatedBy(propertyMeta.operateUserId);
                propertyEntity.setI18nName(propertyMeta.lang);
                // 新增
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

        // 旧数据存放容器
        Map<String, TemplatePropertyDto> templateCategoryMap;

        Map<String, TemplatePropertyDto> templateTagMap;

        List<TemplatePropertyEntity> templatePropertyEntities = new ArrayList<>();

        List<Long> oldPropertyIds;

        // 更新或新数据存放容器
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

            // 删除之前的关联关系重新写入
            if (CollUtil.isNotEmpty(oldPropertyIds)) {
                // 删除该语言配置的旧关系
                propertyRelMapper.deleteBatchIn(oldPropertyIds);
            }

            // 计算出removeIds
            Set<Long> newPropertyIds = new HashSet<>(this.newPropertyIds);
            // 交集 newMemberIds
            newPropertyIds.retainAll(oldPropertyIds);
            // 有交集
            if (!newPropertyIds.isEmpty()) {
                // oldMemberIds 和交集的差集
                oldPropertyIds.removeAll(newPropertyIds);
            }
            if (!oldPropertyIds.isEmpty()) {
                baseMapper.deleteBatchByIds(oldPropertyIds, operateUserId);
            }
        }

    }

    /**
     * 读取某语言的旧配置信息
     * @param meta 上架模板配置更新过程中的上下文
     */
    private void getOldPropertyTableOfSpecifiedLanguage(TemplatePropertyMeta meta) {
        // 组装数据 propertyName -> list<TemplatePropertyDto>
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
        // tag可能会和分类重名
        // categoryName -> templateProperty
        meta.templateCategoryMap = categoryMap;
        // tagName -> templateProperty
        meta.templateTagMap = tagMap;
        // 旧templateProperty数据的记录id
        meta.oldPropertyIds = oldPropertyIds;
    }
}
