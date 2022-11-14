package com.vikadata.api.enterprise.vcode.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.enterprise.vcode.ro.VCodeActivityRo;
import com.vikadata.api.enterprise.vcode.vo.VCodeActivityPageVo;
import com.vikadata.api.enterprise.vcode.vo.VCodeActivityVo;

/**
 * <p>
 * VCod eActivity Service
 * </p>
 */
public interface IVCodeActivityService {

    /**
     * Get basic event information
     */
    List<VCodeActivityVo> getVCodeActivityVo(String keyword);

    /**
     * Get active pagination view information
     */
    IPage<VCodeActivityPageVo> getVCodeActivityPageVo(Page<VCodeActivityPageVo> page, String keyword);

    /**
     * Check if activity exists
     */
    void checkActivityIfExist(Long activityId);

    /**
     * Create Activity
     */
    Long create(VCodeActivityRo ro);

    /**
     * Edit Activity
     */
    void edit(Long userId, Long activityId, VCodeActivityRo ro);

    /**
     * Delete Activity
     */
    void delete(Long userId, Long activityId);

}
