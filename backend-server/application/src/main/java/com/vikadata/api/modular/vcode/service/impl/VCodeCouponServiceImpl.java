package com.vikadata.api.modular.vcode.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.model.ro.vcode.VCodeCouponRo;
import com.vikadata.api.model.vo.vcode.VCodeCouponPageVo;
import com.vikadata.api.model.vo.vcode.VCodeCouponVo;
import com.vikadata.api.modular.vcode.mapper.VCodeCouponMapper;
import com.vikadata.api.modular.vcode.service.IVCodeCouponService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.CodeCouponTemplateEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.VCodeException.COUPON_TEMPLATE_NOT_EXIST;

/**
 * <p>
 * VCode Coupon Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class VCodeCouponServiceImpl implements IVCodeCouponService {

    @Resource
    private VCodeCouponMapper vCodeCouponMapper;

    @Override
    public List<VCodeCouponVo> getVCodeCouponVo(String keyword) {
        return vCodeCouponMapper.selectBaseInfo(keyword);
    }

    @Override
    public IPage<VCodeCouponPageVo> getVCodeCouponPageVo(Page<VCodeCouponPageVo> page, String keyword) {
        return vCodeCouponMapper.selectDetailInfo(page, keyword);
    }

    @Override
    public void checkCouponIfExist(Long templateId) {
        int count = SqlTool.retCount(vCodeCouponMapper.countById(templateId));
        ExceptionUtil.isTrue(count > 0, COUPON_TEMPLATE_NOT_EXIST);
    }

    @Override
    public Long create(VCodeCouponRo ro) {
        CodeCouponTemplateEntity entity = CodeCouponTemplateEntity.builder()
                .totalCount(ro.getCount())
                .comment(ro.getComment())
                .build();
        boolean flag = SqlHelper.retBool(vCodeCouponMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(Long userId, Long templateId, VCodeCouponRo ro) {
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(ro.getCount()) || StrUtil.isNotBlank(ro.getComment()), ParameterException.NO_ARG);
        // Check whether the voucher model exists
        this.checkCouponIfExist(templateId);
        if (ObjectUtil.isNotNull(ro.getCount())) {
            boolean flag = SqlHelper.retBool(vCodeCouponMapper.updateTotalCountById(userId, templateId, ro.getCount()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        if (StrUtil.isNotBlank(ro.getComment())) {
            // Check if the scene value has been used
            boolean flag = SqlHelper.retBool(vCodeCouponMapper.updateCommentById(userId, templateId, ro.getComment()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
    }

    @Override
    public void delete(Long userId, Long templateId) {
        boolean flag = SqlHelper.retBool(vCodeCouponMapper.removeById(userId, templateId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }
}
