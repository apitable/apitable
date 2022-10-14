package com.vikadata.api.modular.template.mapper;

import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.vo.template.AlbumContentVo;
import com.vikadata.api.model.vo.template.AlbumVo;
import com.vikadata.api.modular.template.model.TemplateAlbumDto;
import com.vikadata.entity.TemplateAlbumEntity;

/**
 * <p>
 * Template Center - Template Album Mapper
 * </p>
 *
 * @author Chambers
 * @date 2022/9/23
 */
public interface TemplateAlbumMapper extends BaseMapper<TemplateAlbumEntity> {

    /**
     * query all album ids by
     *
     * @param i18nName i18nName
     * @return AllAlbumIds
     * @author Chambers
     * @date 2022/9/27
     */
    @InterceptorIgnore(illegalSql = "true")
    List<String> selectAllAlbumIdsByI18nName(@Param("i18nName") String i18nName);

    /**
     * query album views by album ids
     *
     * @param albumIds  Album Custom IDs
     * @return AlbumVo List
     * @author Chambers
     * @date 2022/9/27
     */
    List<AlbumVo> selectAlbumVosByAlbumIds(@Param("albumIds") List<String> albumIds);

    /**
     * query album views by i18nName and likeName
     *
     * @param i18nName i18nName
     * @param likeName likeName
     * @return AlbumVo List
     * @author Chambers
     * @date 2022/9/29
     */
    @InterceptorIgnore(illegalSql = "true")
    List<AlbumVo> selectAlbumVosByI18nNameAndNameLike(@Param("i18nName") String i18nName, @Param("likeName") String likeName);

    /**
     * query album content view by album id
     *
     * @param albumId  Album Custom ID
     * @return AlbumContentVo
     * @author Chambers
     * @date 2022/9/27
     */
    AlbumContentVo selectAlbumContentVoByAlbumId(@Param("albumId") String albumId);

    /**
     * query all template album
     *
     * @return TemplateAlbumDto List
     * @author Chambers
     * @date 2022/9/23
     */
    @InterceptorIgnore(illegalSql = "true")
    List<TemplateAlbumDto> selectAllTemplateAlbumDto();

    /**
     * batch insert
     *
     * @param entities Template Album Entities
     * @return affected rows count
     * @author Chambers
     * @date 2022/9/26
     */
    int insertBatch(@Param("entities") List<TemplateAlbumEntity> entities);

    /**
     * remove by albumIds
     *
     * @param albumIds  AlbumIds
     * @param updatedBy Updater User ID
     * @return affected rows count
     * @author Chambers
     * @date 2022/9/26
     */
    int removeByAlbumIds(@Param("albumIds") List<String> albumIds, @Param("updatedBy") Long updatedBy);
}
