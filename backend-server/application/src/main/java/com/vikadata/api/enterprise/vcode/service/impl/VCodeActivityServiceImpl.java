package com.vikadata.api.enterprise.vcode.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.vcode.mapper.VCodeActivityMapper;
import com.vikadata.api.enterprise.vcode.service.IVCodeActivityService;
import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.base.enums.ParameterException;
import com.vikadata.api.enterprise.vcode.ro.VCodeActivityRo;
import com.vikadata.api.enterprise.vcode.vo.VCodeActivityPageVo;
import com.vikadata.api.enterprise.vcode.vo.VCodeActivityVo;
import com.apitable.starter.wx.mp.autoconfigure.WxMpProperties;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.CodeActivityEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enterprise.vcode.enums.VCodeException.ACTIVITY_NOT_EXIST;
import static com.vikadata.api.enterprise.vcode.enums.VCodeException.QR_CODE_EXIST;
import static com.vikadata.api.enterprise.vcode.enums.VCodeException.SCENE_EXIST;

/**
 * <p>
 * VCod eActivity Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class VCodeActivityServiceImpl implements IVCodeActivityService {

    @Resource
    private VCodeActivityMapper vCodeActivityMapper;

    @Autowired(required = false)
    private WxMpProperties wxMpProperties;

    @Override
    public List<VCodeActivityVo> getVCodeActivityVo(String keyword) {
        return vCodeActivityMapper.selectBaseInfo(keyword);
    }

    @Override
    public IPage<VCodeActivityPageVo> getVCodeActivityPageVo(Page<VCodeActivityPageVo> page, String keyword) {
        String appId = wxMpProperties != null ? wxMpProperties.getAppId() : StrUtil.EMPTY;
        return vCodeActivityMapper.selectDetailInfo(page, keyword, appId);
    }

    @Override
    public void checkActivityIfExist(Long activityId) {
        int count = SqlTool.retCount(vCodeActivityMapper.countById(activityId));
        ExceptionUtil.isTrue(count > 0, ACTIVITY_NOT_EXIST);
    }

    @Override
    public Long create(VCodeActivityRo ro) {
        String scene = ro.getScene();
        // Check if the scene value has been used
        List<String> scenes = vCodeActivityMapper.selectAllScene();
        ExceptionUtil.isTrue(CollUtil.isEmpty(scenes) || !scenes.contains(scene), SCENE_EXIST);
        CodeActivityEntity entity = CodeActivityEntity.builder()
                .name(ro.getName())
                .scene(scene)
                .build();
        boolean flag = SqlHelper.retBool(vCodeActivityMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(Long userId, Long activityId, VCodeActivityRo ro) {
        ExceptionUtil.isTrue(StrUtil.isNotBlank(ro.getName()) || StrUtil.isNotBlank(ro.getScene()), ParameterException.NO_ARG);
        // Check if activity exists
        this.checkActivityIfExist(activityId);
        if (StrUtil.isNotBlank(ro.getName())) {
            boolean flag = SqlHelper.retBool(vCodeActivityMapper.updateNameById(userId, activityId, ro.getName()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        if (StrUtil.isNotBlank(ro.getScene())) {
            // Check if the scene value has been used
            List<String> scenes = vCodeActivityMapper.selectAllScene();
            ExceptionUtil.isTrue(CollUtil.isEmpty(scenes) || !scenes.contains(ro.getScene()), SCENE_EXIST);
            if (wxMpProperties == null) {
                return;
            }
            // Check whether the qrcode has been generated, and it is not allowed to be modified,
            // so as to avoid inaccurate statistical data caused by modification during the event
            int qrCodeCount = SqlTool.retCount(vCodeActivityMapper.countQrCodeByIdAndAppId(activityId, wxMpProperties.getAppId()));
            ExceptionUtil.isFalse(qrCodeCount > 0, QR_CODE_EXIST);
            boolean flag = SqlHelper.retBool(vCodeActivityMapper.updateSceneById(userId, activityId, ro.getScene()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
    }

    @Override
    public void delete(Long userId, Long activityId) {
        boolean flag = SqlHelper.retBool(vCodeActivityMapper.removeById(userId, activityId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }
}
