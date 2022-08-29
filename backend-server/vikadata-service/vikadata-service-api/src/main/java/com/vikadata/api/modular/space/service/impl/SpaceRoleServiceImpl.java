package com.vikadata.api.modular.space.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Editor;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.SpaceMenuResourceGroupDto;
import com.vikadata.api.cache.bean.SpaceResourceGroupDto;
import com.vikadata.api.cache.service.SpaceResourceFactory;
import com.vikadata.api.component.notification.NotificationRenderField;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.enums.exception.SpaceException;
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.holder.NotificationRenderFieldHolder;
import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.model.ro.space.AddSpaceRoleRo;
import com.vikadata.api.model.ro.space.UpdateSpaceRoleRo;
import com.vikadata.api.model.vo.space.RoleResourceVo;
import com.vikadata.api.model.vo.space.SpaceRoleDetailVo;
import com.vikadata.api.model.vo.space.SpaceRoleVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.social.service.ISocialService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.modular.space.mapper.SpaceResourceMapper;
import com.vikadata.api.modular.space.mapper.SpaceRoleMapper;
import com.vikadata.api.modular.space.mapper.SpaceRoleResourceRelMapper;
import com.vikadata.api.modular.space.model.SpaceGroupResourceDto;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceMemberRoleRelService;
import com.vikadata.api.modular.space.service.ISpaceResourceService;
import com.vikadata.api.modular.space.service.ISpaceRoleResourceRelService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.util.RoleBuildUtil;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SpaceMemberRoleRelEntity;
import com.vikadata.entity.SpaceRoleEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.PermissionException.CREATE_SUB_ADMIN_ERROR;
import static com.vikadata.api.enums.exception.PermissionException.DELETE_ROLE_ERROR;
import static com.vikadata.api.enums.exception.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.PermissionException.OP_MEMBER_IS_SUB_ADMIN;
import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;

/**
 * <p>
 * 工作空间-角色表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
@Service
@Slf4j
public class SpaceRoleServiceImpl extends ServiceImpl<SpaceRoleMapper, SpaceRoleEntity> implements ISpaceRoleService {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISpaceMemberRoleRelService iSpaceMemberRoleRelService;

    @Resource
    private ISpaceRoleResourceRelService iSpaceRoleResourceRelService;

    @Resource
    private SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    @Resource
    private ISpaceResourceService iSpaceResourceService;

    @Resource
    private SpaceResourceMapper spaceResourceMapper;

    @Resource
    private SpaceRoleResourceRelMapper spaceRoleResourceRelMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SpaceResourceFactory spaceResourceFactory;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private ISocialService iSocialService;

    @Override
    public List<Long> getSpaceAdminsWithWorkbenchManage(String spaceId) {
        log.info("获取空间站拥有工作台管理权限的所有管理员，包含主管理员");
        List<Long> admins = new ArrayList<>();
        Long superAdmin = spaceMapper.selectSpaceMainAdmin(spaceId);
        if (superAdmin != null) {
            admins.add(superAdmin);
        }
        List<Long> subAdmins = spaceMemberRoleRelMapper.selectSubAdminBySpaceId(spaceId);
        if (CollUtil.isNotEmpty(subAdmins)) {
            admins.addAll(subAdmins);
        }
        return admins;
    }

    @Override
    public PageInfo<SpaceRoleVo> roleList(String spaceId, IPage<SpaceRoleVo> page) {
        IPage<SpaceRoleVo> pageResult = baseMapper.selectSpaceRolePage(page, spaceId);
        CollUtil.filter(pageResult.getRecords(), (Editor<SpaceRoleVo>) spaceRoleVo -> {
            List<String> resourceGroupCodes = StrUtil.split(spaceRoleVo.getTempResourceGroupCodes(), ',');
            List<SpaceMenuResourceGroupDto> menuResourceGroupDtos = spaceResourceFactory.getMenuResourceGroup();
            Map<String, List<String>> groups = CollUtil.newHashMap();
            for (SpaceMenuResourceGroupDto menuResourceGroupDto : menuResourceGroupDtos) {
                for (SpaceResourceGroupDto groupResource : menuResourceGroupDto.getGroupResources()) {
                    if (CollUtil.contains(resourceGroupCodes, groupResource.getGroupCode())) {
                        List<String> groupNames = groups.get(menuResourceGroupDto.getMenuName());
                        if (CollUtil.isEmpty(groupNames)) {
                            groupNames = new ArrayList<>();
                        }
                        groupNames.add(groupResource.getGroupName());
                        groups.put(menuResourceGroupDto.getMenuName(), groupNames);
                    }
                }
            }
            List<RoleResourceVo> resourceVos = new ArrayList<>();

            for (Map.Entry<String, List<String>> entry : groups.entrySet()) {
                RoleResourceVo resourceVo = new RoleResourceVo();
                resourceVo.setGroupName(entry.getKey());
                resourceVo.setResourceNames(entry.getValue());
                resourceVos.add(resourceVo);
            }

            spaceRoleVo.setResourceGroupCodes(resourceGroupCodes);
            spaceRoleVo.setResourceScope(resourceVos);
            return spaceRoleVo;
        });
        return PageHelper.build(pageResult);
    }

    @Override
    public SpaceRoleEntity create(String spaceId) {
        log.info("创建子管理员角色");
        SpaceRoleEntity spaceRole = new SpaceRoleEntity();
        spaceRole.setRoleCode(RoleBuildUtil.createRoleCode(spaceId));
        spaceRole.setRoleName(RoleBuildUtil.createRoleName(spaceId));
        boolean flag = save(spaceRole);
        ExceptionUtil.isTrue(flag, CREATE_SUB_ADMIN_ERROR);
        return spaceRole;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createRole(String spaceId, AddSpaceRoleRo data) {
        log.info("创建管理员角色");
        //检查前置条件
        this.checkBeforeCreate(spaceId, data.getMemberIds());
        //分配的权限
        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByGroupCode(CollUtil.distinct(data.getResourceCodes()));
        //检查是否包含了可分配的权限,排除不合理的权限分配
        iSpaceResourceService.checkResourceAssignable(resourceCodes);
        //检查当前分配的权限列表是否拥有
        LoginContext.me().checkSpaceResource(resourceCodes);

        // 分别为成员创建角色、角色与成员关联
        List<SpaceRoleEntity> spaceRoleEntities = new ArrayList<>();
        List<SpaceMemberRoleRelEntity> spaceMemberRoleRelEntities = new ArrayList<>();
        List<String> roleCodes = new ArrayList<>();
        for (Long memberId : data.getMemberIds()) {
            String roleCode = RoleBuildUtil.createRoleCode(spaceId);
            roleCodes.add(roleCode);
            // 子管理员角色
            SpaceRoleEntity spaceRole = new SpaceRoleEntity();
            spaceRole.setId(IdWorker.getId());
            spaceRole.setRoleCode(roleCode);
            spaceRole.setRoleName(RoleBuildUtil.createRoleName(spaceId));
            spaceRoleEntities.add(spaceRole);
            // 角色与成员关联
            SpaceMemberRoleRelEntity spaceMemberRoleRel = new SpaceMemberRoleRelEntity();
            spaceMemberRoleRel.setId(IdWorker.getId());
            spaceMemberRoleRel.setSpaceId(spaceId);
            spaceMemberRoleRel.setMemberId(memberId);
            spaceMemberRoleRel.setRoleCode(roleCode);
            spaceMemberRoleRelEntities.add(spaceMemberRoleRel);
        }
        // 保存角色
        boolean flag = saveBatch(spaceRoleEntities);
        ExceptionUtil.isTrue(flag, CREATE_SUB_ADMIN_ERROR);
        // 保存角色与成员关联
        boolean relFlag = iSpaceMemberRoleRelService.saveBatch(spaceMemberRoleRelEntities);
        ExceptionUtil.isTrue(relFlag, CREATE_SUB_ADMIN_ERROR);
        // 保存角色与权限关联
        iSpaceRoleResourceRelService.createBatch(roleCodes, CollUtil.distinct(resourceCodes));
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(data.getMemberIds()).build());
    }

    @Override
    public void checkIsNotSubAdmin(String spaceId, Long memberId) {
        log.info("检查成员是否不是子管理员");
        boolean exist = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId)) > 0;
        ExceptionUtil.isFalse(exist, OP_MEMBER_IS_SUB_ADMIN);
    }

    public void checkIsNotSubAdmin(String spaceId, List<Long> memberIds) {
        log.info("检查成员是否不是子管理员");
        boolean exist = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberIds(spaceId, memberIds)) > 0;
        ExceptionUtil.isFalse(exist, OP_MEMBER_IS_SUB_ADMIN);
    }

    @Override
    public void checkIsSubAdmin(String spaceId, Long memberId) {
        log.info("检查成员是否是管理员");
        boolean exist = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId)) > 0;
        ExceptionUtil.isTrue(exist, OP_MEMBER_IS_SUB_ADMIN);
    }

    @Override
    public void checkBeforeCreate(String spaceId, Long memberId) {
        //校验空间内是否存在此成员，并且非主管理员
        iSpaceService.checkMemberInSpace(spaceId, memberId);
        //选择成员必须非主管理员
        iSpaceService.checkMemberIsMainAdmin(spaceId, memberId);
        //是否不是子管理员
        this.checkIsNotSubAdmin(spaceId, memberId);
    }

    public void checkBeforeCreate(String spaceId, List<Long> memberIds) {
        //校验空间内是否存在此成员，并且非主管理员
        iSpaceService.checkMembersInSpace(spaceId, memberIds);
        //选择成员必须非主管理员
        iSpaceService.checkMembersIsMainAdmin(spaceId, memberIds);
        //是否不是子管理员
        this.checkIsNotSubAdmin(spaceId, memberIds);
    }

    @Override
    public SpaceRoleDetailVo getRoleDetail(String spaceId, Long memberId) {
        log.info("获取管理员信息");
        MemberEntity memberEntity = memberMapper.selectMemberIdAndSpaceId(spaceId, memberId);
        ExceptionUtil.isNotNull(memberEntity, MEMBER_NOT_IN_SPACE);
        SpaceRoleDetailVo spaceRoleDetailVo = new SpaceRoleDetailVo();
        spaceRoleDetailVo.setMemberName(memberEntity.getMemberName());

        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByMemberId(memberId);
        List<SpaceGroupResourceDto> spaceGroupResourceDtos = spaceResourceMapper.selectGroupResource();

        List<String> adminResources = new ArrayList<>();
        for (SpaceGroupResourceDto groupResourceDto : spaceGroupResourceDtos) {
            if (CollUtil.containsAny(resourceCodes, groupResourceDto.getResources())) {
                adminResources.add(groupResourceDto.getGroupCode());
            }
        }
        spaceRoleDetailVo.setResources(adminResources);
        return spaceRoleDetailVo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(String spaceId, UpdateSpaceRoleRo data) {
        log.info("编辑管理员");
        // 查询当前成员和成员关联对象
        SpaceMemberRoleRelEntity memberRole = iSpaceMemberRoleRelService.findById(data.getId());
        ExceptionUtil.isTrue(memberRole.getSpaceId().equals(spaceId), NOT_IN_SPACE);
        boolean replace = !memberRole.getMemberId().equals(data.getMemberId());
        if (replace) {
            //重新选择成员，必须检查新成员条件
            this.checkBeforeCreate(spaceId, data.getMemberId());
            iSpaceMemberRoleRelService.updateMemberIdById(data.getId(), data.getMemberId());
        }
        //分配的权限
        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByGroupCode(CollUtil.distinct(data.getResourceCodes()));
        //检查是否包含了可分配的权限,排除不合理的权限分配
        iSpaceResourceService.checkResourceAssignable(resourceCodes);
        //检查当前分配的权限列表是否拥有
        LoginContext.me().checkSpaceResource(resourceCodes);

        //更新角色权限
        List<String> originCodes = baseMapper.selectResourceCodesById(data.getId());
        List<String> unionCodes = (List<String>) CollUtil.union(originCodes, resourceCodes);
        List<String> addList = (List<String>) CollUtil.disjunction(unionCodes, originCodes);
        log.info("新增列表:{}", addList);
        if (CollUtil.isNotEmpty(addList)) {
            iSpaceRoleResourceRelService.createBatch(Collections.singletonList(memberRole.getRoleCode()), addList);
        }
        List<String> removeList = (List<String>) CollUtil.disjunction(unionCodes, resourceCodes);
        log.info("删除列表:{}", removeList);
        if (CollUtil.isNotEmpty(removeList)) {
            iSpaceRoleResourceRelService.deleteBatch(memberRole.getRoleCode(), removeList);
        }
        //若原拥有邀请成员的权限，替换了管理员或者原管理员该权限被删除，且该空间全员可邀请成员的开关处于关闭时，原管理员生成的空间公开邀请链接均失效
        String tag = "INVITE_MEMBER";
        if (originCodes.contains(tag)) {
            if (replace) {
                iSpaceInviteLinkService.delByMemberIdIfNotInvite(spaceId, memberRole.getMemberId());
            }
            else if (removeList.contains(tag)) {
                iSpaceInviteLinkService.delByMemberIdIfNotInvite(spaceId, memberRole.getMemberId());
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteRole(String spaceId, Long memberId) {
        log.info("删除管理员");
        String roleCode = spaceMemberRoleRelMapper.selectRoleCodeByMemberId(spaceId, memberId);

        // 如果角色还绑定别人，不能删除角色
        List<Long> memberIds = spaceMemberRoleRelMapper.selectMemberIdBySpaceIdAndRoleCodes(spaceId, Collections.singletonList(roleCode));
        if (CollUtil.isEmpty(memberIds)) {
            boolean roleFlag = SqlHelper.retBool(baseMapper.deleteByRoleCode(roleCode));
            ExceptionUtil.isTrue(roleFlag, DELETE_ROLE_ERROR);

            boolean roleResourceDeleteFlag = SqlHelper.retBool(spaceRoleResourceRelMapper.deleteByRoleCode(roleCode));
            ExceptionUtil.isTrue(roleResourceDeleteFlag, DELETE_ROLE_ERROR);
        }

        boolean memberRoleFlag = SqlHelper.retBool(spaceMemberRoleRelMapper.deleteBySpaceIdAndMemberId(spaceId, memberId));
        ExceptionUtil.isTrue(memberRoleFlag, DELETE_ROLE_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchRemoveByMemberIds(String spaceId, List<Long> memberIds) {
        List<String> roleCodes = spaceMemberRoleRelMapper.selectRoleCodeByMemberIds(spaceId, memberIds);
        spaceMemberRoleRelMapper.batchDeleteByMemberIds(memberIds);
        if (CollUtil.isNotEmpty(roleCodes)) {
            // 查询仍存在的角色编码。如果角色还绑定别人，不能删除角色
            List<String> existRoleCodes = spaceMemberRoleRelMapper.selectRoleCodesBySpaceIdAndRoleCodes(spaceId, roleCodes);
            if (roleCodes.size() == existRoleCodes.size()) {
                return;
            }
            List<String> delRoleCodes = existRoleCodes.size() == 0 ? roleCodes : CollUtil.subtractToList(roleCodes, existRoleCodes);
            if (CollUtil.isNotEmpty(delRoleCodes)) {
                baseMapper.batchDeleteByRoleCode(delRoleCodes);
                spaceRoleResourceRelMapper.batchDeleteByRoleCodes(delRoleCodes);
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBySpaceId(String spaceId) {
        List<String> roleCodes = spaceMemberRoleRelMapper.selectRoleCodesBySpaceId(spaceId);
        if (CollUtil.isNotEmpty(roleCodes)) {
            baseMapper.batchDeleteByRoleCode(roleCodes);
            spaceRoleResourceRelMapper.batchDeleteByRoleCodes(roleCodes);
        }
        spaceMemberRoleRelMapper.deleteBySpaceId(spaceId);

    }

    @Override
    public void checkAdminResourceChangeAllow(String spaceId, List<String> operateResourceCodes) {
        log.info("第三方集成开启情况下，检查子管理员的变更权限是否存在无法操作的权限");
        List<String> disableRoleGroupCodes = iSocialService.getSocialDisableRoleGroupCode(spaceId);
        if (CollUtil.isNotEmpty(disableRoleGroupCodes)) {
            ExceptionUtil.isEmpty(CollUtil.intersection(operateResourceCodes, disableRoleGroupCodes), SpaceException.NO_ALLOW_OPERATE);
        }
    }
}
