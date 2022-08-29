package com.vikadata.api.modular.vcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.vikadata.api.model.vo.vcode.VCodeCouponPageVo;
import com.vikadata.api.model.vo.vcode.VCodeCouponVo;
import com.vikadata.entity.CodeCouponTemplateEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * V码系统-兑换券模板表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/20
 */
public interface VCodeCouponMapper extends BaseMapper<CodeCouponTemplateEntity> {

    /**
     * 检查指定活动是否存在
     *
     * @param id 表ID
     * @return count
     * @author Chambers
     * @date 2020/8/20
     */
    Integer countById(@Param("id") Long id);

    /**
     * 修改兑换数
     *
     * @param userId 用户ID
     * @param id     表ID
     * @param count  兑换数
     * @return 变更数
     * @author Chambers
     * @date 2020/8/19
     */
    Integer updateTotalCountById(@Param("userId") Long userId, @Param("id") Long id, @Param("count") Integer count);

    /**
     * 修改备注
     *
     * @param userId  用户ID
     * @param id      表ID
     * @param comment 备注
     * @return 变更数
     * @author Chambers
     * @date 2020/8/19
     */
    Integer updateCommentById(@Param("userId") Long userId, @Param("id") Long id, @Param("comment") String comment);

    /**
     * 逻辑删除
     *
     * @param userId 用户ID
     * @param id     表ID
     * @return 变更数
     * @author Chambers
     * @date 2020/8/20
     */
    int removeById(@Param("userId") Long userId, @Param("id") Long id);

    /**
     * 获取兑换券模板基本信息
     *
     * @param keyword 搜索关键词
     * @return 基本信息
     * @author Chambers
     * @date 2020/8/19
     */
    List<VCodeCouponVo> selectBaseInfo(@Param("keyword") String keyword);

    /**
     * 分页获取兑换券模板详细信息
     *
     * @param page    分页请求对象
     * @param keyword 搜索关键词
     * @return 活动视图
     * @author Chambers
     * @date 2020/8/19
     */
    IPage<VCodeCouponPageVo> selectDetailInfo(Page page, @Param("keyword") String keyword);
}
