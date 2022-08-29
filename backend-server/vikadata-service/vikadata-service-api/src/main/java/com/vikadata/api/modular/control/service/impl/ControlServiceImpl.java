package com.vikadata.api.modular.control.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.ControlType;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.control.mapper.ControlMapper;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.control.service.IControlSettingService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.ControlEntity;
import com.vikadata.entity.MemberEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-01 19:36:16
 */
@Service
@Slf4j
public class ControlServiceImpl extends ServiceImpl<ControlMapper, ControlEntity> implements IControlService {

    @Resource
    private ControlMapper controlMapper;

    @Resource
    private IControlRoleService iControlRoleService;

    @Resource
    private IControlSettingService iControlSettingService;

    @Resource
    private IMemberService iMemberService;

    @Override
    public ControlEntity getByControlId(String controlId) {
        log.info("查询控制权限单元信息");
        return controlMapper.selectByControlId(controlId);
    }

    @Override
    public void checkControlStatus(String controlId, Consumer<Boolean> consumer) {
        log.info("检查权限控制单元状态「{}」", controlId);
        int count = SqlTool.retCount(controlMapper.selectCountByControlId(controlId));
        consumer.accept(count > 0);
    }

    @Override
    public void create(Long userId, String spaceId, String controlId, ControlType controlType) {
        log.info("创建权限控制单元。userId:{},spaceId:{},controlId:{}", userId, spaceId, controlId);
        ControlEntity deletedEntity = controlMapper.selectDeletedByControlIdAndSpaceId(controlId, spaceId, controlType);
        boolean flag;
        if (deletedEntity != null) {
            deletedEntity.setIsDeleted(false);
            deletedEntity.setUpdatedBy(userId);
            flag =
                    SqlHelper.retBool(controlMapper.updateIsDeletedByIds(Collections.singletonList(deletedEntity.getId()), userId, false));
        }
        else {
            ControlEntity entity = ControlEntity.builder()
                    .id(IdWorker.getId())
                    .spaceId(spaceId)
                    .controlId(controlId)
                    .controlType(controlType.getVal())
                    .createdBy(userId)
                    .updatedBy(userId)
                    .build();
            flag = SqlHelper.retBool(controlMapper.insertBatch(Collections.singletonList(entity)));
        }
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeControl(Long userId, List<String> controlIds, boolean delSetting) {
        log.info("删除指定控制单元「{}」", controlIds);
        boolean flag = SqlHelper.retBool(controlMapper.deleteByControlIds(userId, controlIds));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        // 删除指定控制单元的所有角色（可能不存在任何角色）
        iControlRoleService.removeByControlIds(userId, controlIds);
        // 删除指定控制单元设置
        if (delSetting) {
            iControlSettingService.removeByControlIds(userId, controlIds);
        }
    }

    @Override
    public List<String> getControlIdByControlIdPrefixAndType(String prefix, Integer type) {
        return controlMapper.selectControlIdByControlIdPrefixAndType(prefix, type);
    }

    @Override
    public List<String> getExistedControlId(List<String> controlIds) {
        return controlMapper.selectControlIdByControlIds(controlIds);
    }

    @Override
    public Long getOwnerMemberId(String controlId) {
        log.info("获取权限控制单元「{}」拥有者的成员ID", controlId);
        ControlEntity controlEntity = controlMapper.selectByControlId(controlId);
        if (controlEntity == null) {
            return null;
        }
        if (controlEntity.getUpdatedBy() == null) {
            return null;
        }
        MemberEntity memberEntity = iMemberService.getByUserIdAndSpaceId(controlEntity.getUpdatedBy(), controlEntity.getSpaceId());
        if (memberEntity == null) {
            return null;
        }
        return memberEntity.getId();
    }
}
