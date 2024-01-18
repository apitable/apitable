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

import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.template.entity.TemplateAlbumEntity;
import com.apitable.template.enums.TemplateAlbumRelType;
import com.apitable.template.mapper.TemplateAlbumMapper;
import com.apitable.template.mapper.TemplateAlbumRelMapper;
import com.apitable.template.mapper.TemplatePropertyMapper;
import com.apitable.template.service.ITemplateAlbumService;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Template Center - Template Album Service Implement Class.
 * </p>
 */
@Slf4j
@Service
public class TemplateAlbumServiceImpl extends ServiceImpl<TemplateAlbumMapper, TemplateAlbumEntity>
    implements ITemplateAlbumService {

    @Resource
    private TemplateAlbumRelMapper templateAlbumRelMapper;

    @Resource
    private TemplatePropertyMapper templatePropertyMapper;

    @Override
    public List<AlbumVo> getAlbumVosByAlbumIds(List<String> albumIds) {
        if (albumIds.isEmpty()) {
            return new ArrayList<>();
        }
        return baseMapper.selectAlbumVosByAlbumIds(albumIds);
    }

    @Override
    public List<AlbumVo> getAlbumVosByCategoryCode(String categoryCode) {
        List<String> albumIds = templateAlbumRelMapper.selectAlbumIdByRelateIdAndType(categoryCode,
            TemplateAlbumRelType.TEMPLATE_CATEGORY.getType());
        if (albumIds.isEmpty()) {
            return new ArrayList<>();
        }
        return this.getAlbumVosByAlbumIds(albumIds);
    }

    @Override
    public List<AlbumVo> getRecommendedAlbums(String lang, Integer maxCount,
                                              String excludeAlbumId) {
        List<String> allAlbumIds = baseMapper.selectAllAlbumIdsByI18nName(lang);
        if (excludeAlbumId != null) {
            allAlbumIds.remove(excludeAlbumId);
        }
        if (allAlbumIds.size() <= maxCount) {
            return this.getAlbumVosByAlbumIds(allAlbumIds);
        }
        Set<String> albumIds = new HashSet<>();
        Random rand = new Random();
        for (int i = 0; i < maxCount; i++) {
            int randomIndex = rand.nextInt(allAlbumIds.size());
            albumIds.add(allAlbumIds.get(randomIndex));
        }
        return this.getAlbumVosByAlbumIds(new ArrayList<>(albumIds));
    }

    @Override
    public List<AlbumVo> searchAlbums(String lang, String keyword) {
        return baseMapper.selectAlbumVosByI18nNameAndNameLike(lang, keyword);
    }

    @Override
    public AlbumContentVo getAlbumContentVo(String albumId) {
        // query album info
        AlbumContentVo albumContentVo = baseMapper.selectAlbumContentVoByAlbumId(albumId);
        ExceptionUtil.isNotNull(albumContentVo, DatabaseException.QUERY_EMPTY_BY_ID);
        // query album relate ids
        List<String> tagCodes = templateAlbumRelMapper.selectRelateIdByAlbumIdAndType(albumId,
            TemplateAlbumRelType.TEMPLATE_TAG.getType());
        if (tagCodes.isEmpty()) {
            return albumContentVo;
        }
        // query relate tag name
        List<String> tagNames = templatePropertyMapper.selectPropertyNameByPropertyCodeIn(tagCodes);
        albumContentVo.setTags(tagNames);
        return albumContentVo;
    }
}
