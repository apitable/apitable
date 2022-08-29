package com.vikadata.api.modular.vcode.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.model.ro.vcode.VCodeCouponRo;
import com.vikadata.api.model.vo.vcode.VCodeCouponPageVo;
import com.vikadata.api.model.vo.vcode.VCodeCouponVo;

/**
 * <p>
 * V 码兑换券模板 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/14
 */
public interface IVCodeCouponService {

    /**
     * 获取V码兑换券模板信息
     *
     * @param keyword   搜索关键词（非必须）
     * @return VCodeActivityVos
     * @author Chambers
     * @date 2022/6/24
     */
    List<VCodeCouponVo> getVCodeCouponVo(String keyword);

    /**
     * 获取V码兑换券模板分页视图信息
     *
     * @param page      分页请求对象
     * @param keyword   搜索关键词（非必须）
     * @return VCodeCouponPageVo
     * @author Chambers
     * @date 2022/6/24
     */
    IPage<VCodeCouponPageVo> getVCodeCouponPageVo(Page<VCodeCouponPageVo> page, String keyword);

    /**
     * 检查兑换券模是否存在
     *
     * @param templateId 兑换券模板ID
     * @author Chambers
     * @date 2020/8/20
     */
    void checkCouponIfExist(Long templateId);

    /**
     * 创建
     *
     * @param ro 请求参数
     * @return id
     * @author Chambers
     * @date 2020/8/14
     */
    Long create(VCodeCouponRo ro);

    /**
     * 编辑
     *
     * @param userId     用户ID
     * @param templateId 兑换券模板ID
     * @param ro         请求参数
     * @author Chambers
     * @date 2020/8/14
     */
    void edit(Long userId, Long templateId, VCodeCouponRo ro);

    /**
     * 删除V码兑换券模板
     *
     * @param userId     用户ID
     * @param templateId 兑换券模板表ID
     * @author Chambers
     * @date 2022/6/24
     */
    void delete(Long userId, Long templateId);
}
