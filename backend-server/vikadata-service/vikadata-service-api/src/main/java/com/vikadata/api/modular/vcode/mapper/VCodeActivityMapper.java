package com.vikadata.api.modular.vcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.vikadata.api.model.vo.vcode.VCodeActivityPageVo;
import com.vikadata.api.model.vo.vcode.VCodeActivityVo;
import com.vikadata.entity.CodeActivityEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * VCode Activity Mapper
 * </p>
 */
public interface VCodeActivityMapper extends BaseMapper<CodeActivityEntity> {

    /**
     * Get all active scene values
     */
    List<String> selectAllScene();

    /**
     * Query table id
     */
    Long selectIdByScene(@Param("scene") String scene);

    /**
     * Update name
     */
    int updateNameById(@Param("userId") Long userId, @Param("id") Long id, @Param("name") String name);

    /**
     * Update scene
     */
    int updateSceneById(@Param("userId") Long userId, @Param("id") Long id, @Param("scene") String scene);

    /**
     * Update delete status
     */
    int removeById(@Param("userId") Long userId, @Param("id") Long id);

    /**
     * Query count(Check if the specified activity exists)
     */
    Integer countById(@Param("id") Long id);

    /**
     * Get basic event information
     */
    List<VCodeActivityVo> selectBaseInfo(@Param("keyword") String keyword);

    /**
     * Paginate to get event details
     */
    IPage<VCodeActivityPageVo> selectDetailInfo(Page<VCodeActivityPageVo> page, @Param("keyword") String keyword, @Param("appId") String appId);

    /**
     * Query the number of QR codes corresponding to the activity
     */
    Integer countQrCodeByIdAndAppId(@Param("id") Long id, @Param("appId") String appId);
}
