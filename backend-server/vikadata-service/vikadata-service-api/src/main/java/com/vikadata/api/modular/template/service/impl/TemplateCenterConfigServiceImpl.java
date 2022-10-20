package com.vikadata.api.modular.template.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.Banner;
import com.vikadata.api.cache.bean.RecommendConfig;
import com.vikadata.api.cache.bean.RecommendConfig.AlbumGroup;
import com.vikadata.api.cache.bean.RecommendConfig.TemplateGroup;
import com.vikadata.api.cache.service.ITemplateConfigService;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.base.SystemConfigType;
import com.vikadata.api.enums.template.TemplateAlbumRelType;
import com.vikadata.api.enums.template.TemplatePropertyType;
import com.vikadata.api.model.dto.template.TemplateInfo;
import com.vikadata.api.model.ro.template.TemplateCenterConfigRo;
import com.vikadata.api.modular.base.mapper.SystemConfigMapper;
import com.vikadata.api.modular.base.model.SystemConfigDTO;
import com.vikadata.api.modular.template.mapper.TemplateAlbumMapper;
import com.vikadata.api.modular.template.mapper.TemplateAlbumRelMapper;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.template.mapper.TemplatePropertyMapper;
import com.vikadata.api.modular.template.mapper.TemplatePropertyRelMapper;
import com.vikadata.api.modular.template.model.TemplateAlbumDto;
import com.vikadata.api.modular.template.model.TemplatePropertyDto;
import com.vikadata.api.modular.template.service.ITemplateCenterConfigService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.SystemConfigEntity;
import com.vikadata.entity.TemplateAlbumEntity;
import com.vikadata.entity.TemplateAlbumRelEntity;
import com.vikadata.entity.TemplatePropertyEntity;
import com.vikadata.entity.TemplatePropertyRelEntity;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.template.RecommendInfo;
import com.vikadata.integration.vika.model.template.Template;
import com.vikadata.integration.vika.model.template.TemplateAlbum;
import com.vikadata.integration.vika.model.template.TemplateCategory;
import com.vikadata.integration.vika.model.template.TemplateCenterConfigInfo;
import com.vikadata.integration.vika.model.template.TemplateConfigDatasheetParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * <p>
 * Template Center - Template Album Service Implement Class
 * </p>
 *
 * @author Chambers
 * @date 2022/9/23
 */
@Slf4j
@Service
public class TemplateCenterConfigServiceImpl implements ITemplateCenterConfigService {

    @Resource
    private TemplateMapper templateMapper;

    @Resource
    private TemplateAlbumMapper templateAlbumMapper;

    @Resource
    private TemplateAlbumRelMapper templateAlbumRelMapper;

    @Resource
    private TemplatePropertyMapper templatePropertyMapper;

    @Resource
    private TemplatePropertyRelMapper templatePropertyRelMapper;

    @Resource
    private SystemConfigMapper systemConfigMapper;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private TransactionTemplate transactionTemplate;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private ITemplateConfigService iTemplateConfigService;

    /**
     * Template Center Entry Relation
     *
     * Template Album Entry: Recommend or Official Template Category
     * Template Entry: Recommend or Official Template Category or Template Album
     * Template Tag Entry: Template
     */
    @Override
    public void updateTemplateCenterConfig(Long userId, TemplateCenterConfigRo ro) {
        // get datasheet config by api
        List<TemplateCenterConfigInfo> configInfos = vikaOperations.getTemplateCenterConfigInfos(ro.getHost(), ro.getToken(), BeanUtil.copyProperties(ro, TemplateConfigDatasheetParam.class));

        // get official space template name map
        String spaceId = constProperties.getTemplateSpace();
        Map<String, String> tplNameToTplIdMap = this.getTplNameToTplIdMap(spaceId);

        // check if template from datasheet config is existed
        configInfos.forEach(info -> {
            Optional<Template> template = info.getTemplate().stream().filter(item -> !tplNameToTplIdMap.containsKey(item.getName())).findFirst();
            template.ifPresent(tpl -> {
                throw new BusinessException(StrUtil.format("Template「{}」is not exist!", tpl.getName()));
            });
        });

        // prepare template existing data
        TemplateExistingData existingData = new TemplateExistingData(tplNameToTplIdMap);
        // init change set
        TemplateChangeSet changeSet = new TemplateChangeSet();

        // datasheet config convert to db data
        for (TemplateCenterConfigInfo configInfo : configInfos) {
            // 1. template tag data
            this.handleTemplateTag(userId, configInfo, existingData, changeSet);

            // 2. template album data(keep order, maybe depends on the new tag id)
            this.handleTemplateAlbum(userId, configInfo, existingData, changeSet);

            // 3. template category data & recommend config db data (keep order, maybe depends on the new album id & new template id)
            this.handleTemplateCategory(userId, configInfo, existingData, changeSet);
            this.handleRecommend(userId, configInfo, existingData, changeSet);
        }

        // compute disuse data
        this.computeDisuseChangeSet(existingData, changeSet);
        // execute change set
        this.executeChangeSet(userId, changeSet);
        // delete cache
        existingData.i18nToRecommendMap.keySet().forEach(lang -> {
            iTemplateConfigService.deleteRecommendConfigCacheByLang(lang);
            iTemplateConfigService.deleteCategoriesListConfigCacheByLang(lang);
        });
    }

    public void executeChangeSet(Long userId, TemplateChangeSet changeSet) {
        transactionTemplate.execute(s -> {
            changeSet.doDelete(userId);
            changeSet.doSaveOrUpdate(userId);
            return null;
        });
    }

    private void computeDisuseChangeSet(TemplateExistingData existingData, TemplateChangeSet changeSet) {
        // recommend
        List<Long> retainedUsedConfigIds = changeSet.updateSystemConfigEntities.stream().map(SystemConfigEntity::getId).collect(Collectors.toList());
        changeSet.disuseRecommendConfigId = existingData.i18nToRecommendMap.values().stream()
                .map(SystemConfigDTO::getId)
                .filter(id -> !retainedUsedConfigIds.contains(id))
                .collect(Collectors.toList());

        // album
        List<String> retainedUsedAlbumIds = changeSet.updateTemplateAlbumEntities.stream().map(TemplateAlbumEntity::getAlbumId).collect(Collectors.toList());
        existingData.allAlbumIds.removeAll(retainedUsedAlbumIds);
        changeSet.disuseAlbumIds = existingData.allAlbumIds;

        // category or tag property
        existingData.allPropertyCodes.removeAll(changeSet.retainedUsedPropertyCodes);
        changeSet.disusePropertyCodes = existingData.allPropertyCodes;
    }

    private void handleRecommend(Long userId, TemplateCenterConfigInfo configInfo, TemplateExistingData existingData, TemplateChangeSet changeSet) {
        String i18n = configInfo.getI18n();
        Map<String, String> tplNameToTplIdMap = existingData.tplNameToTplIdMap;

        // convert recommend db data
        RecommendInfo recommend = configInfo.getRecommend();
        RecommendConfig recommendDBConfig = new RecommendConfig();
        // top banner
        if (CollUtil.isNotEmpty(recommend.getTop())) {
            List<Banner> top = recommend.getTop().stream()
                    .map(item -> new Banner(tplNameToTplIdMap.get(item.getTemplateName()), item.getImage(), item.getTitle(), item.getDesc(), item.getColor()))
                    .collect(Collectors.toList());
            recommendDBConfig.setTop(top);
        }

        // custom album group
        if (CollUtil.isNotEmpty(recommend.getAlbumGroups())) {
            List<AlbumGroup> albumGroups = new ArrayList<>();
            Map<String, TemplateAlbumDto> albumNameToAlbumMap = existingData.getAlbumNameToAlbumMap(i18n);
            for (RecommendInfo.AlbumGroup group : recommend.getAlbumGroups()) {
                AlbumGroup albumGroup = new AlbumGroup();
                albumGroup.setName(group.getName());
                List<String> albumIds = group.getAlbumNames().stream().map(item -> albumNameToAlbumMap.get(item).getAlbumId()).collect(Collectors.toList());
                albumGroup.setAlbumIds(albumIds);
                albumGroups.add(albumGroup);
            }
            recommendDBConfig.setAlbumGroups(albumGroups);
        }

        // custom template group
        if (CollUtil.isNotEmpty(recommend.getTemplateGroups())) {
            List<TemplateGroup> templateGroups = new ArrayList<>();
            for (RecommendInfo.TemplateGroup group : recommend.getTemplateGroups()) {
                TemplateGroup templateGroup = new TemplateGroup();
                templateGroup.setName(group.getName());
                List<String> templateIds = group.getTemplateNames().stream().map(item -> existingData.tplNameToTplIdMap.get(item)).collect(Collectors.toList());
                templateGroup.setTemplateIds(templateIds);
                templateGroups.add(templateGroup);
            }
            recommendDBConfig.setTemplateGroups(templateGroups);
        }

        SystemConfigEntity systemConfigEntity = new SystemConfigEntity();
        systemConfigEntity.setConfigMap(JSONUtil.toJsonStr(recommendDBConfig));
        systemConfigEntity.setUpdatedBy(userId);
        // if it exists, update config value
        if (existingData.i18nToRecommendMap.containsKey(i18n)) {
            systemConfigEntity.setId(existingData.i18nToRecommendMap.get(i18n).getId());
            changeSet.updateSystemConfigEntities.add(systemConfigEntity);
        }
        else {
            // if it not exists, create new entity
            systemConfigEntity.setId(IdWorker.getId());
            systemConfigEntity.setType(SystemConfigType.RECOMMEND_CONFIG.getType());
            systemConfigEntity.setI18nName(i18n);
            systemConfigEntity.setCreatedBy(userId);
            changeSet.insertSystemConfigEntities.add(systemConfigEntity);
        }
    }

    private void handleTemplateCategory(Long userId, TemplateCenterConfigInfo configInfo, TemplateExistingData existingData, TemplateChangeSet changeSet) {
        if (CollUtil.isEmpty(configInfo.getTemplateCategories())) {
            return;
        }
        String i18n = configInfo.getI18n();
        Map<String, TemplatePropertyDto> categoryNameToPropertyMap = existingData.getCategoryNameToPropertyMap(i18n);

        int order = 0;
        for (TemplateCategory category : configInfo.getTemplateCategories()) {
            // template category property
            TemplatePropertyDto propertyDto = this.handleTemplateProperty(userId, i18n, category.getName(), TemplatePropertyType.CATEGORY, categoryNameToPropertyMap, changeSet);

            // template category & album rel
            if (CollUtil.isNotEmpty(category.getAlbumNames())) {
                Map<String, TemplateAlbumDto> albumNameToAlbumMap = existingData.getAlbumNameToAlbumMap(i18n);
                for (String albumName : category.getAlbumNames()) {
                    // create property rel
                    String albumId = albumNameToAlbumMap.get(albumName).getAlbumId();
                    this.createTemplateAlbumRel(albumId, TemplateAlbumRelType.TEMPLATE_CATEGORY, propertyDto.getPropertyCode(), changeSet);
                }
            }

            // template category & template rel
            if (CollUtil.isNotEmpty(category.getTemplateNames())) {
                for (String templateName : category.getTemplateNames()) {
                    String templateId = existingData.tplNameToTplIdMap.get(templateName);
                    // create property rel
                    this.createTemplatePropertyRel(templateId, propertyDto, order, changeSet);
                }
            }
            order++;
        }

    }

    private void handleTemplateTag(Long userId, TemplateCenterConfigInfo configInfo, TemplateExistingData existingData, TemplateChangeSet changeSet) {
        if (CollUtil.isEmpty(configInfo.getTemplate())) {
            return;
        }
        String i18n = configInfo.getI18n();
        Map<String, TemplatePropertyDto> tagNameToPropertyMap = existingData.getTagNameToPropertyMap(i18n);

        for (Template template : configInfo.getTemplate()) {
            if (CollUtil.isEmpty(template.getTemplateTags())) {
                continue;
            }
            String templateId = existingData.tplNameToTplIdMap.get(template.getName());
            int order = 0;
            for (String tagName : template.getTemplateTags()) {
                // template tag property
                TemplatePropertyDto propertyDto = this.handleTemplateProperty(userId, i18n, tagName, TemplatePropertyType.TAG, tagNameToPropertyMap, changeSet);
                // create property rel
                this.createTemplatePropertyRel(templateId, propertyDto, order, changeSet);
                order++;
            }
        }
    }

    private TemplatePropertyDto handleTemplateProperty(Long userId, String i18n, String propName, TemplatePropertyType type,
            Map<String, TemplatePropertyDto> propNameToPropertyMap, TemplateChangeSet changeSet) {
        // if it exists, reuse property code
        if (propNameToPropertyMap.containsKey(propName)) {
            TemplatePropertyDto propertyDto = propNameToPropertyMap.get(propName);
            changeSet.retainedUsedPropertyCodes.add(propertyDto.getPropertyCode());
            return propertyDto;
        }
        // if it not exists, create new entity
        TemplatePropertyEntity propertyEntity = new TemplatePropertyEntity();
        Long propId = IdWorker.getId();
        propertyEntity.setId(propId);
        propertyEntity.setPropertyName(propName);
        String propCode = type == TemplatePropertyType.CATEGORY ? IdUtil.createTempCatCode() : IdUtil.createTempTagCode();
        propertyEntity.setPropertyCode(propCode);
        propertyEntity.setPropertyType(type.getType());
        propertyEntity.setI18nName(i18n);
        propertyEntity.setCreatedBy(userId);
        changeSet.insertTemplatePropertyEntities.add(propertyEntity);

        // add to map, it would be used by same prop name again
        TemplatePropertyDto propertyDto = new TemplatePropertyDto(propId, propName, propCode, type.getType(), i18n);
        propNameToPropertyMap.put(propName, propertyDto);
        return propertyDto;
    }

    private void createTemplatePropertyRel(String templateId, TemplatePropertyDto propertyDto, int order, TemplateChangeSet changeSet) {
        if (StrUtil.isBlank(templateId)) {
            return;
        }
        TemplatePropertyRelEntity relEntity = new TemplatePropertyRelEntity();
        relEntity.setId(IdWorker.getId());
        relEntity.setTemplateId(templateId);
        relEntity.setPropertyId(propertyDto.getPropertyId());
        relEntity.setPropertyCode(propertyDto.getPropertyCode());
        relEntity.setPropertyOrder(order);
        changeSet.insertTemplatePropertyRelEntities.add(relEntity);
    }

    private void handleTemplateAlbum(Long userId, TemplateCenterConfigInfo configInfo, TemplateExistingData existingData, TemplateChangeSet changeSet) {
        if (CollUtil.isEmpty(configInfo.getAlbums())) {
            return;
        }
        String i18n = configInfo.getI18n();
        Map<String, TemplateAlbumDto> albumNameToAlbumMap = existingData.getAlbumNameToAlbumMap(i18n);

        for (TemplateAlbum album : configInfo.getAlbums()) {
            String albumId;
            TemplateAlbumEntity albumEntity = new TemplateAlbumEntity();
            albumEntity.setI18nName(i18n);
            albumEntity.setCover(album.getCover());
            albumEntity.setDescription(album.getDescription());
            albumEntity.setContent(album.getContent());
            albumEntity.setAuthorName(album.getPublisherName());
            albumEntity.setAuthorLogo(album.getPublisherLogo());
            albumEntity.setAuthorDesc(album.getPublisherDesc());
            albumEntity.setUpdatedBy(userId);

            // if it exists, reuse album id
            if (albumNameToAlbumMap.containsKey(album.getName())) {
                TemplateAlbumDto albumDto = albumNameToAlbumMap.get(album.getName());
                albumId = albumDto.getAlbumId();
                albumEntity.setId(albumDto.getId());
                albumEntity.setAlbumId(albumId);
                changeSet.updateTemplateAlbumEntities.add(albumEntity);
            }
            else {
                // if it not exists, create new entity
                albumId = IdUtil.createTemplateAlbumId();
                albumEntity.setId(IdWorker.getId());
                albumEntity.setAlbumId(albumId);
                albumEntity.setName(album.getName());
                albumEntity.setCreatedBy(userId);
                changeSet.insertTemplateAlbumEntities.add(albumEntity);
                // add to map, it would be used by same album name again
                albumNameToAlbumMap.put(album.getName(), new TemplateAlbumDto(albumEntity.getId(), albumId, i18n, album.getName()));
            }

            // album & template rel
            if (CollUtil.isNotEmpty(album.getTemplateNames())) {
                for (String templateName : album.getTemplateNames()) {
                    // create property rel
                    String templateId = existingData.tplNameToTplIdMap.get(templateName);
                    this.createTemplateAlbumRel(albumId, TemplateAlbumRelType.TEMPLATE, templateId, changeSet);
                }
            }
            // album & template tag rel
            if (CollUtil.isNotEmpty(album.getTemplateTags())) {
                Map<String, TemplatePropertyDto> tagNameToPropertyMap = existingData.getTagNameToPropertyMap(i18n);
                for (String tagName : album.getTemplateTags()) {
                    // create property rel
                    String tagCode = tagNameToPropertyMap.get(tagName).getPropertyCode();
                    this.createTemplateAlbumRel(albumId, TemplateAlbumRelType.TEMPLATE_TAG, tagCode, changeSet);
                }
            }
        }
    }

    private void createTemplateAlbumRel(String albumId, TemplateAlbumRelType type, String relateId, TemplateChangeSet changeSet) {
        TemplateAlbumRelEntity relEntity = new TemplateAlbumRelEntity();
        relEntity.setId(IdWorker.getId());
        relEntity.setAlbumId(albumId);
        relEntity.setType(type.getType());
        relEntity.setRelateId(relateId);
        changeSet.insertTemplateAlbumRelEntities.add(relEntity);
    }

    class TemplateExistingData {
        Map<String, String> tplNameToTplIdMap;

        Map<String, SystemConfigDTO> i18nToRecommendMap;

        List<String> allAlbumIds;

        Map<String, Map<String, TemplateAlbumDto>> i18nToAlbumNameToAlbumMap;

        List<String> allPropertyCodes;

        Map<String, Map<String, TemplatePropertyDto>> i18nToCategoryNameToPropertyMap;

        Map<String, Map<String, TemplatePropertyDto>> i18nToTagNameToPropertyMap;

        public TemplateExistingData(Map<String, String> templateMap) {
            tplNameToTplIdMap = templateMap;

            // prepare recommend config data
            List<SystemConfigDTO> recommendConfigs = systemConfigMapper.selectConfigDtoByType(SystemConfigType.RECOMMEND_CONFIG.getType());
            i18nToRecommendMap = recommendConfigs.stream()
                    .collect(Collectors.toMap(SystemConfigDTO::getI18nName, i -> i));

            // prepare album data
            List<TemplateAlbumDto> albums = templateAlbumMapper.selectAllTemplateAlbumDto();
            allAlbumIds = albums.stream().map(TemplateAlbumDto::getAlbumId).collect(Collectors.toList());
            i18nToAlbumNameToAlbumMap = albums.stream()
                    .collect(Collectors.groupingBy(TemplateAlbumDto::getI18nName,
                            Collectors.toMap(TemplateAlbumDto::getName, i -> i)));

            // prepare category & tag data
            List<TemplatePropertyDto> templateProperties = templatePropertyMapper.selectAllTemplatePropertyDto();
            allPropertyCodes = templateProperties.stream().map(TemplatePropertyDto::getPropertyCode).collect(Collectors.toList());
            i18nToCategoryNameToPropertyMap = templateProperties.stream()
                    .filter(prop -> TemplatePropertyType.CATEGORY.getType() == prop.getPropertyType())
                    .collect(Collectors.groupingBy(TemplatePropertyDto::getI18nName,
                            Collectors.toMap(TemplatePropertyDto::getPropertyName, i -> i)));
            i18nToTagNameToPropertyMap = templateProperties.stream()
                    .filter(prop -> TemplatePropertyType.TAG.getType() == prop.getPropertyType())
                    .collect(Collectors.groupingBy(TemplatePropertyDto::getI18nName,
                            Collectors.toMap(TemplatePropertyDto::getPropertyName, i -> i)));
        }

        Map<String, TemplateAlbumDto> getAlbumNameToAlbumMap(String i18n) {
            if (!i18nToAlbumNameToAlbumMap.containsKey(i18n)) {
                i18nToAlbumNameToAlbumMap.put(i18n, new HashMap<>());
            }
            return i18nToAlbumNameToAlbumMap.get(i18n);
        }

        Map<String, TemplatePropertyDto> getCategoryNameToPropertyMap(String i18n) {
            if (!i18nToCategoryNameToPropertyMap.containsKey(i18n)) {
                i18nToCategoryNameToPropertyMap.put(i18n, new HashMap<>());
            }
            return i18nToCategoryNameToPropertyMap.get(i18n);
        }

        Map<String, TemplatePropertyDto> getTagNameToPropertyMap(String i18n) {
            if (!i18nToTagNameToPropertyMap.containsKey(i18n)) {
                i18nToTagNameToPropertyMap.put(i18n, new HashMap<>());
            }
            return i18nToTagNameToPropertyMap.get(i18n);
        }
    }

    class TemplateChangeSet {

        List<Long> disuseRecommendConfigId = new ArrayList<>();

        List<SystemConfigEntity> updateSystemConfigEntities = new ArrayList<>();

        List<SystemConfigEntity> insertSystemConfigEntities = new ArrayList<>();

        List<String> disuseAlbumIds = new ArrayList<>();

        List<TemplateAlbumEntity> updateTemplateAlbumEntities = new ArrayList<>();

        List<TemplateAlbumEntity> insertTemplateAlbumEntities = new ArrayList<>();

        List<TemplateAlbumRelEntity> insertTemplateAlbumRelEntities = new ArrayList<>();

        List<String> disusePropertyCodes = new ArrayList<>();

        List<String> retainedUsedPropertyCodes = new ArrayList<>();

        List<TemplatePropertyEntity> insertTemplatePropertyEntities = new ArrayList<>();

        List<TemplatePropertyRelEntity> insertTemplatePropertyRelEntities = new ArrayList<>();

        void doSaveOrUpdate(Long userId) {
            if (!insertSystemConfigEntities.isEmpty()) {
                systemConfigMapper.insertBatch(insertSystemConfigEntities);
            }
            if (!updateSystemConfigEntities.isEmpty()) {
                updateSystemConfigEntities.forEach(entity -> systemConfigMapper.updateById(entity));
            }
            if (!updateTemplateAlbumEntities.isEmpty()) {
                updateTemplateAlbumEntities.forEach(entity -> templateAlbumMapper.updateById(entity));
            }
            if (!insertTemplateAlbumEntities.isEmpty()) {
                templateAlbumMapper.insertBatch(insertTemplateAlbumEntities);
            }
            if (!insertTemplateAlbumRelEntities.isEmpty()) {
                templateAlbumRelMapper.insertBatch(insertTemplateAlbumRelEntities);
            }
            if (!insertTemplatePropertyEntities.isEmpty()) {
                templatePropertyMapper.insertBatch(insertTemplatePropertyEntities);
            }
            if (!retainedUsedPropertyCodes.isEmpty()) {
                templatePropertyMapper.updateUpdatedByByPropertyCodes(retainedUsedPropertyCodes, userId);
            }
            if (!insertTemplatePropertyRelEntities.isEmpty()) {
                templatePropertyRelMapper.insertBatch(insertTemplatePropertyRelEntities);
            }
        }

        void doDelete(Long userId) {
            templateAlbumRelMapper.deleteBatch();

            templatePropertyRelMapper.deleteBatch();

            if (!disuseRecommendConfigId.isEmpty()) {
                systemConfigMapper.removeByIds(disuseRecommendConfigId, userId);
            }
            if (!disuseAlbumIds.isEmpty()) {
                templateAlbumMapper.removeByAlbumIds(disuseAlbumIds, userId);
            }
            if (!disusePropertyCodes.isEmpty()) {
                templatePropertyMapper.removeByPropertyCodes(disusePropertyCodes, userId);
            }
        }
    }

    private Map<String, String> getTplNameToTplIdMap(String spaceId) {
        List<TemplateInfo> templateInfos = templateMapper.selectInfoByTypeId(spaceId);
        if (templateInfos.isEmpty()) {
            throw new BusinessException("There is no template in the official space.");
        }
        return templateInfos.stream().collect(Collectors.toMap(TemplateInfo::getName, TemplateInfo::getTemplateId));
    }
}
