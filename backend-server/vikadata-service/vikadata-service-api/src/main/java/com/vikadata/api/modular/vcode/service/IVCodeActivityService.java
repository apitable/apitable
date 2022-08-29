package com.vikadata.api.modular.vcode.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.model.ro.vcode.VCodeActivityRo;
import com.vikadata.api.model.vo.vcode.VCodeActivityPageVo;
import com.vikadata.api.model.vo.vcode.VCodeActivityVo;

/**
 * <p>
 * V 码活动 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/14
 */
public interface IVCodeActivityService {

    /**
     * 获取活动基本信息
     *
     * @param keyword   搜索关键词（非必须）
     * @return VCodeActivityVos
     * @author Chambers
     * @date 2022/6/24
     */
    List<VCodeActivityVo> getVCodeActivityVo(String keyword);

    /**
     * 获取活动分页视图信息
     *
     * @param page      分页请求对象
     * @param keyword   搜索关键词（非必须）
     * @return VCodeActivityPageVo
     * @author Chambers
     * @date 2022/6/24
     */
    IPage<VCodeActivityPageVo> getVCodeActivityPageVo(Page<VCodeActivityPageVo> page, String keyword);

    /**
     * 检查活动是否存在
     *
     * @param activityId 活动ID
     * @author Chambers
     * @date 2020/8/20
     */
    void checkActivityIfExist(Long activityId);

    /**
     * 创建活动
     *
     * @param ro 请求参数
     * @return id
     * @author Chambers
     * @date 2020/8/14
     */
    Long create(VCodeActivityRo ro);

    /**
     * 编辑活动信息
     *
     * @param userId     用户ID
     * @param activityId 活动ID
     * @param ro         请求参数
     * @author Chambers
     * @date 2020/8/14
     */
    void edit(Long userId, Long activityId, VCodeActivityRo ro);

    /**
     * 删除活动
     *
     * @param userId     用户ID
     * @param activityId 活动ID
     * @author Chambers
     * @date 2022/6/24
     */
    void delete(Long userId, Long activityId);

}
