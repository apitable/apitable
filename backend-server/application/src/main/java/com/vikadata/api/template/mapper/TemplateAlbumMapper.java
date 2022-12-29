package com.vikadata.api.template.mapper;

import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.template.vo.AlbumContentVo;
import com.vikadata.api.template.vo.AlbumVo;
import com.vikadata.api.template.model.TemplateAlbumDto;
import com.vikadata.entity.TemplateAlbumEntity;

/**
 * <p>
 * Template Center - Template Album Mapper
 * </p>
 */
public interface TemplateAlbumMapper extends BaseMapper<TemplateAlbumEntity> {

    /**
     * query all album ids by i18n
     */
    @InterceptorIgnore(illegalSql = "true")
    List<String> selectAllAlbumIdsByI18nName(@Param("i18nName") String i18nName);

    /**
     * query album views by album ids
     */
    List<AlbumVo> selectAlbumVosByAlbumIds(@Param("albumIds") List<String> albumIds);

    /**
     * query album views by i18nName and likeName
     */
    @InterceptorIgnore(illegalSql = "true")
    List<AlbumVo> selectAlbumVosByI18nNameAndNameLike(@Param("i18nName") String i18nName, @Param("likeName") String likeName);

    /**
     * query album content view by album id
     */
    AlbumContentVo selectAlbumContentVoByAlbumId(@Param("albumId") String albumId);

    /**
     * query all template album
     */
    @InterceptorIgnore(illegalSql = "true")
    List<TemplateAlbumDto> selectAllTemplateAlbumDto();

    /**
     * batch insert
     */
    int insertBatch(@Param("entities") List<TemplateAlbumEntity> entities);

    /**
     * remove by albumIds
     */
    int removeByAlbumIds(@Param("albumIds") List<String> albumIds, @Param("updatedBy") Long updatedBy);
}
