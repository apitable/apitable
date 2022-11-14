package com.vikadata.api.template.service;

import java.util.List;

import com.vikadata.api.template.vo.AlbumContentVo;
import com.vikadata.api.template.vo.AlbumVo;

/**
 * <p>
 * Template Center - Template Album Service
 * </p>
 */
public interface ITemplateAlbumService {

    /**
     * get template album views by album ids
     */
    List<AlbumVo> getAlbumVosByAlbumIds(List<String> albumIds);

    /**
     * get template album views by category code
     */
    List<AlbumVo> getAlbumVosByCategoryCode(String categoryCode);

    /**
     * get recommended albums
     */
    List<AlbumVo> getRecommendedAlbums(String lang, Integer maxCount, String excludeAlbumId);

    /**
     * fuzzy search album
     */
    List<AlbumVo> searchAlbums(String lang, String keyword);

    /**
     * get album content view
     */
    AlbumContentVo getAlbumContentVo(String albumId);
}
