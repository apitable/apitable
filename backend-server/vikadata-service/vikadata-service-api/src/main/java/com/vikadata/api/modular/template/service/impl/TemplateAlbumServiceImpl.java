package com.vikadata.api.modular.template.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;
import org.beetl.android.util.ArraySet;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.template.TemplateAlbumRelType;
import com.vikadata.api.model.vo.template.AlbumContentVo;
import com.vikadata.api.model.vo.template.AlbumVo;
import com.vikadata.api.modular.template.mapper.TemplateAlbumMapper;
import com.vikadata.api.modular.template.mapper.TemplateAlbumRelMapper;
import com.vikadata.api.modular.template.mapper.TemplatePropertyMapper;
import com.vikadata.api.modular.template.service.ITemplateAlbumService;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Template Center - Template Album Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class TemplateAlbumServiceImpl implements ITemplateAlbumService {

    @Resource
    private TemplateAlbumMapper templateAlbumMapper;

    @Resource
    private TemplateAlbumRelMapper templateAlbumRelMapper;

    @Resource
    private TemplatePropertyMapper templatePropertyMapper;

    @Override
    public List<AlbumVo> getAlbumVosByAlbumIds(List<String> albumIds) {
        return templateAlbumMapper.selectAlbumVosByAlbumIds(albumIds);
    }

    @Override
    public List<AlbumVo> getAlbumVosByCategoryCode(String categoryCode) {
        List<String> albumIds = templateAlbumRelMapper.selectAlbumIdByRelateIdAndType(categoryCode, TemplateAlbumRelType.TEMPLATE_CATEGORY.getType());
        if (albumIds.isEmpty()) {
            return new ArrayList<>();
        }
        return this.getAlbumVosByAlbumIds(albumIds);
    }

    @Override
    public List<AlbumVo> getRecommendedAlbums(String lang, Integer maxCount, String excludeAlbumId) {
        List<String> allAlbumIds = templateAlbumMapper.selectAllAlbumIdsByI18nName(lang);
        if (excludeAlbumId != null) {
            allAlbumIds.remove(excludeAlbumId);
        }
        if (allAlbumIds.size() <= maxCount) {
            return this.getAlbumVosByAlbumIds(allAlbumIds);
        }
        Set<String> albumIds = new ArraySet<>();
        Random rand = new Random();
        for (int i = 0; i < maxCount; i++) {
            int randomIndex = rand.nextInt(allAlbumIds.size());
            albumIds.add(allAlbumIds.get(randomIndex));
        }
        return this.getAlbumVosByAlbumIds(new ArrayList<>(albumIds));
    }

    @Override
    public List<AlbumVo> searchAlbums(String lang, String keyword) {
        return templateAlbumMapper.selectAlbumVosByI18nNameAndNameLike(lang, keyword);
    }

    @Override
    public AlbumContentVo getAlbumContentVo(String albumId) {
        // query album info
        AlbumContentVo albumContentVo = templateAlbumMapper.selectAlbumContentVoByAlbumId(albumId);
        ExceptionUtil.isNotNull(albumContentVo, DatabaseException.QUERY_EMPTY_BY_ID);
        // query album relate ids
        List<String> tagCodes = templateAlbumRelMapper.selectRelateIdByAlbumIdAndType(albumId, TemplateAlbumRelType.TEMPLATE_TAG.getType());
        if (tagCodes.isEmpty()) {
            return albumContentVo;
        }
        // query relate tag name
        List<String> tagNames = templatePropertyMapper.selectPropertyNameByPropertyCodeIn(tagCodes);
        albumContentVo.setTags(tagNames);
        return albumContentVo;
    }
}
