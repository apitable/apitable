package com.vikadata.api.enterprise.vcode.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.enterprise.vcode.ro.VCodeCouponRo;
import com.vikadata.api.enterprise.vcode.vo.VCodeCouponPageVo;
import com.vikadata.api.enterprise.vcode.vo.VCodeCouponVo;

/**
 * <p>
 * VCode Coupon Service
 * </p>
 */
public interface IVCodeCouponService {

    /**
     * Get VCode Voucher Template Information
     */
    List<VCodeCouponVo> getVCodeCouponVo(String keyword);

    /**
     * Get the page view information of the VCode coupon template
     */
    IPage<VCodeCouponPageVo> getVCodeCouponPageVo(Page<VCodeCouponPageVo> page, String keyword);

    /**
     * Check whether the voucher model exists
     */
    void checkCouponIfExist(Long templateId);

    /**
     * Create coupon
     */
    Long create(VCodeCouponRo ro);

    /**
     * Edit coupon
     */
    void edit(Long userId, Long templateId, VCodeCouponRo ro);

    /**
     * Delete coupon
     */
    void delete(Long userId, Long templateId);
}
