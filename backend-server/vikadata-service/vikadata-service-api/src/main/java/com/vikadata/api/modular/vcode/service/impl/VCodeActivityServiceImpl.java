package com.vikadata.api.modular.vcode.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.model.ro.vcode.VCodeActivityRo;
import com.vikadata.api.model.vo.vcode.VCodeActivityPageVo;
import com.vikadata.api.model.vo.vcode.VCodeActivityVo;
import com.vikadata.api.modular.vcode.mapper.VCodeActivityMapper;
import com.vikadata.api.modular.vcode.service.IVCodeActivityService;
import com.vikadata.boot.autoconfigure.wx.mp.WxMpProperties;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.CodeActivityEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.VCodeException.ACTIVITY_NOT_EXIST;
import static com.vikadata.api.enums.exception.VCodeException.QR_CODE_EXIST;
import static com.vikadata.api.enums.exception.VCodeException.SCENE_EXIST;

/**
 * <p>
 * V 码活动 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/8/14
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
        log.info("检查活动是否存在");
        int count = SqlTool.retCount(vCodeActivityMapper.countById(activityId));
        ExceptionUtil.isTrue(count > 0, ACTIVITY_NOT_EXIST);
    }

    @Override
    public Long create(VCodeActivityRo ro) {
        log.info("创建活动");
        String scene = ro.getScene();
        // 校验场景值是否已被使用
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
        log.info("编辑活动信息");
        ExceptionUtil.isTrue(StrUtil.isNotBlank(ro.getName()) || StrUtil.isNotBlank(ro.getScene()), ParameterException.NO_ARG);
        // 检查活动是否存在
        this.checkActivityIfExist(activityId);
        if (StrUtil.isNotBlank(ro.getName())) {
            boolean flag = SqlHelper.retBool(vCodeActivityMapper.updateNameById(userId, activityId, ro.getName()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
        if (StrUtil.isNotBlank(ro.getScene())) {
            // 校验场景值是否已被使用
            List<String> scenes = vCodeActivityMapper.selectAllScene();
            ExceptionUtil.isTrue(CollUtil.isEmpty(scenes) || !scenes.contains(ro.getScene()), SCENE_EXIST);
            if (wxMpProperties == null) {
                return;
            }
            // 校验是否已生成二维码，已生成不允许修改，避免活动期间修改造成统计数据不准确
            int qrCodeCount = SqlTool.retCount(vCodeActivityMapper.countQrCodeByIdAndAppId(activityId, wxMpProperties.getAppId()));
            ExceptionUtil.isFalse(qrCodeCount > 0, QR_CODE_EXIST);
            boolean flag = SqlHelper.retBool(vCodeActivityMapper.updateSceneById(userId, activityId, ro.getScene()));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
    }

    @Override
    public void delete(Long userId, Long activityId) {
        // 逻辑删除
        boolean flag = SqlHelper.retBool(vCodeActivityMapper.removeById(userId, activityId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }
}
