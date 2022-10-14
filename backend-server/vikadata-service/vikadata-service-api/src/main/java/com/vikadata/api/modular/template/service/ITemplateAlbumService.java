package com.vikadata.api.modular.template.service;

import java.util.List;

import com.vikadata.api.model.vo.template.AlbumContentVo;
import com.vikadata.api.model.vo.template.AlbumVo;

/**
 * <p>
 * Template Center - Template Album Service
 * </p>
 *
 * @author Chambers
 * @date 2022/9/27
 */
public interface ITemplateAlbumService {

    /**
     * get template album views by album ids
     *
     * @param albumIds  Album Custom IDs
     * @return AlbumVo List
     * @author Chambers
     * @date 2022/9/27
     */
    List<AlbumVo> getAlbumVosByAlbumIds(List<String> albumIds);

    /**
     * get template album views by category code
     *
     * @param categoryCode template category property code
     * @return AlbumVo List
     * @author Chambers
     * @date 2022/9/27
     */
    List<AlbumVo> getAlbumVosByCategoryCode(String categoryCode);

    /**
     * get recommended albums
     *
     * @param lang  i18n
     * @param maxCount max count of load
     * @param excludeAlbumId exclude album custom id
     * @return AlbumVo List
     * @author Chambers
     * @date 2022/9/27
     */
    List<AlbumVo> getRecommendedAlbums(String lang, Integer maxCount, String excludeAlbumId);

    /**
     * fuzzy search album
     *
     * @param lang      i18n
     * @param keyword   search keyword
     * @return AlbumVo List
     * @author Chambers
     * @date 2022/9/27
     */
    List<AlbumVo> searchAlbums(String lang, String keyword);

    /**
     * get album content view
     *
     * @param albumId  Album Custom ID
     * @return AlbumContentVo
     * @author Chambers
     * @date 2022/9/27
     */
    AlbumContentVo getAlbumContentVo(String albumId);
}
