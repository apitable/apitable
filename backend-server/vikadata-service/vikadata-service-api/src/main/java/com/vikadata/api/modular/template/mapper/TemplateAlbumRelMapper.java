package com.vikadata.api.modular.template.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.TemplateAlbumRelEntity;

/**
 * <p>
 * Template Center - Template Album Rel Mapper
 * </p>
 *
 * @author Chambers
 * @date 2022/9/23
 */
public interface TemplateAlbumRelMapper extends BaseMapper<TemplateAlbumRelEntity> {

    /**
     * query album ids by relate id and type
     *
     * @param relateId  relate id
     * @param type      relate type
     * @return AlbumId List
     * @author Chambers
     * @date 2022/9/27
     */
    List<String> selectAlbumIdByRelateIdAndType(@Param("relateId") String relateId, @Param("type") Integer type);

    /**
     * query relate ids by albumId id and type
     *
     * @param albumId   album id
     * @param type      relate type
     * @return RelateId List
     * @author Chambers
     * @date 2022/10/9
     */
    List<String> selectRelateIdByAlbumIdAndType(@Param("albumId") String albumId, @Param("type") Integer type);

    /**
     * batch insert
     *
     * @param entities Template Album Rel Entities
     * @return affected rows count
     * @author Chambers
     * @date 2022/9/26
     */
    int insertBatch(@Param("entities") List<TemplateAlbumRelEntity> entities);

    /**
     * batch delete
     *
     * @return affected rows count
     * @author Chambers
     * @date 2022/9/26
     */
    int deleteBatch();

}
