package com.vikadata.api.enterprise.vcode.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.vcode.vo.VCodeCouponPageVo;
import com.vikadata.api.enterprise.vcode.vo.VCodeCouponVo;
import com.vikadata.entity.CodeCouponTemplateEntity;

/**
 * <p>
 * VCode Coupon Mapper
 * </p>
 */
public interface VCodeCouponMapper extends BaseMapper<CodeCouponTemplateEntity> {

    /**
     * Check if the specified activity exists
     */
    Integer countById(@Param("id") Long id);

    /**
     * Update total count
     */
    Integer updateTotalCountById(@Param("userId") Long userId, @Param("id") Long id, @Param("count") Integer count);

    /**
     * Update Comment
     */
    Integer updateCommentById(@Param("userId") Long userId, @Param("id") Long id, @Param("comment") String comment);

    /**
     * Update delete status
     */
    int removeById(@Param("userId") Long userId, @Param("id") Long id);

    /**
     * Get basic information of coupon template
     */
    List<VCodeCouponVo> selectBaseInfo(@Param("keyword") String keyword);

    /**
     * Paginate to get the details of the coupon template
     */
    IPage<VCodeCouponPageVo> selectDetailInfo(Page page, @Param("keyword") String keyword);
}
