/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.space.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Editor;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.shared.cache.bean.SpaceMenuResourceGroupDto;
import com.apitable.shared.cache.bean.SpaceResourceGroupDto;
import com.apitable.shared.cache.service.SpaceResourceCacheService;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.util.RoleBuildUtil;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.space.dto.SpaceGroupResourceDto;
import com.apitable.space.entity.SpaceMemberRoleRelEntity;
import com.apitable.space.entity.SpaceRoleEntity;
import com.apitable.space.enums.SpaceException;
import com.apitable.space.enums.SpaceResourceGroupCode;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.mapper.SpaceMemberRoleRelMapper;
import com.apitable.space.mapper.SpaceResourceMapper;
import com.apitable.space.mapper.SpaceRoleMapper;
import com.apitable.space.mapper.SpaceRoleResourceRelMapper;
import com.apitable.space.ro.AddSpaceRoleRo;
import com.apitable.space.ro.UpdateSpaceRoleRo;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceMemberRoleRelService;
import com.apitable.space.service.ISpaceResourceService;
import com.apitable.space.service.ISpaceRoleResourceRelService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.RoleResourceVo;
import com.apitable.space.vo.SpaceRoleDetailVo;
import com.apitable.space.vo.SpaceRoleVo;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.apitable.space.enums.SpaceException.NOT_IN_SPACE;
import static com.apitable.workspace.enums.PermissionException.CREATE_SUB_ADMIN_ERROR;
import static com.apitable.workspace.enums.PermissionException.DELETE_ROLE_ERROR;
import static com.apitable.workspace.enums.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.apitable.workspace.enums.PermissionException.OP_MEMBER_IS_SUB_ADMIN;

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
    private SpaceResourceCacheService spaceResourceFactory;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Override
    public List<Long> getSpaceAdminsWithWorkbenchManage(String spaceId) {
        log.info("Queries all space administrators who have workbench permission，including the main admin.");
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
        log.info("Create a sub-administrator role");
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
        log.info("Create an administrator role");
        this.checkBeforeCreate(spaceId, data.getMemberIds());
        // assign permissions
        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByGroupCode(CollUtil.distinct(data.getResourceCodes()));
        // Check whether assignable permissions are included to exclude unreasonable permission assignments
        iSpaceResourceService.checkResourceAssignable(resourceCodes);
        // Check whether the currently assigned permission list is owned
        LoginContext.me().checkSpaceResource(resourceCodes);

        // create space role and the ref of space role and member
        List<SpaceRoleEntity> spaceRoleEntities = new ArrayList<>();
        List<SpaceMemberRoleRelEntity> spaceMemberRoleRelEntities = new ArrayList<>();
        List<String> roleCodes = new ArrayList<>();
        for (Long memberId : data.getMemberIds()) {
            String roleCode = RoleBuildUtil.createRoleCode(spaceId);
            roleCodes.add(roleCode);
            SpaceRoleEntity spaceRole = new SpaceRoleEntity();
            spaceRole.setId(IdWorker.getId());
            spaceRole.setRoleCode(roleCode);
            spaceRole.setRoleName(RoleBuildUtil.createRoleName(spaceId));
            spaceRoleEntities.add(spaceRole);
            SpaceMemberRoleRelEntity spaceMemberRoleRel = new SpaceMemberRoleRelEntity();
            spaceMemberRoleRel.setId(IdWorker.getId());
            spaceMemberRoleRel.setSpaceId(spaceId);
            spaceMemberRoleRel.setMemberId(memberId);
            spaceMemberRoleRel.setRoleCode(roleCode);
            spaceMemberRoleRelEntities.add(spaceMemberRoleRel);
        }
        boolean flag = saveBatch(spaceRoleEntities);
        ExceptionUtil.isTrue(flag, CREATE_SUB_ADMIN_ERROR);
        boolean relFlag = iSpaceMemberRoleRelService.saveBatch(spaceMemberRoleRelEntities);
        ExceptionUtil.isTrue(relFlag, CREATE_SUB_ADMIN_ERROR);
        // save the ref space role and resource code.
        iSpaceRoleResourceRelService.createBatch(roleCodes, CollUtil.distinct(resourceCodes));
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(data.getMemberIds()).build());
    }

    @Override
    public void checkIsNotSubAdmin(String spaceId, Long memberId) {
        log.info("check whether member is not sub admin");
        boolean exist = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId)) > 0;
        ExceptionUtil.isFalse(exist, OP_MEMBER_IS_SUB_ADMIN);
    }

    public void checkIsNotSubAdmin(String spaceId, List<Long> memberIds) {
        log.info("check whether members is not sub admin");
        boolean exist = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberIds(spaceId, memberIds)) > 0;
        ExceptionUtil.isFalse(exist, OP_MEMBER_IS_SUB_ADMIN);
    }

    @Override
    public void checkBeforeCreate(String spaceId, Long memberId) {
        iSpaceService.checkMemberInSpace(spaceId, memberId);
        iSpaceService.checkMemberIsMainAdmin(spaceId, memberId);
        this.checkIsNotSubAdmin(spaceId, memberId);
    }

    public void checkBeforeCreate(String spaceId, List<Long> memberIds) {
        iSpaceService.checkMembersInSpace(spaceId, memberIds);
        iSpaceService.checkMembersIsMainAdmin(spaceId, memberIds);
        this.checkIsNotSubAdmin(spaceId, memberIds);
    }

    @Override
    public SpaceRoleDetailVo getRoleDetail(String spaceId, Long memberId) {
        log.info("get admin info");
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
        log.info("edit admin");
        SpaceMemberRoleRelEntity memberRole = iSpaceMemberRoleRelService.findById(data.getId());
        ExceptionUtil.isTrue(memberRole.getSpaceId().equals(spaceId), NOT_IN_SPACE);
        boolean replace = !memberRole.getMemberId().equals(data.getMemberId());
        if (replace) {
            // To re-select a member, you must check the new member criteria
            this.checkBeforeCreate(spaceId, data.getMemberId());
            iSpaceMemberRoleRelService.updateMemberIdById(data.getId(), data.getMemberId());
        }
        // assigned permissions
        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByGroupCode(CollUtil.distinct(data.getResourceCodes()));
        // Check whether assignable permissions are included to exclude unreasonable permission assignments
        iSpaceResourceService.checkResourceAssignable(resourceCodes);
        // Check whether the currently assigned permission list is owned
        LoginContext.me().checkSpaceResource(resourceCodes);

        // updating role permisions
        List<String> originCodes = baseMapper.selectResourceCodesById(data.getId());
        List<String> unionCodes = (List<String>) CollUtil.union(originCodes, resourceCodes);
        List<String> addList = (List<String>) CollUtil.disjunction(unionCodes, originCodes);
        log.info("add:{}", addList);
        if (CollUtil.isNotEmpty(addList)) {
            iSpaceRoleResourceRelService.createBatch(Collections.singletonList(memberRole.getRoleCode()), addList);
        }
        List<String> removeList = (List<String>) CollUtil.disjunction(unionCodes, resourceCodes);
        log.info("remove:{}", removeList);
        if (CollUtil.isNotEmpty(removeList)) {
            iSpaceRoleResourceRelService.deleteBatch(memberRole.getRoleCode(), removeList);
        }
        // When the function of inviting all members of the space is turned off,
        // all public invitation links generated by the original main administrator become invalid.
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
        log.info("delete role");
        String roleCode = spaceMemberRoleRelMapper.selectRoleCodeByMemberId(spaceId, memberId);

        // If a role is bound to someone else, you cannot delete the role
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
            // Query for role codes that still exist. If a role is bound to someone else, you cannot delete the role
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
    public List<SpaceResourceGroupCode> getSpaceDisableResourceCodeIfSocialConnect(String spaceId) {
        SocialConnectInfo bindTenantInfo = socialServiceFacade.getConnectInfo(spaceId);
        if (bindTenantInfo != null) {
            return bindTenantInfo.getDisableResourceGroupCodes();
        }
        return Collections.emptyList();
    }

    @Override
    public void checkAdminResourceChangeAllow(String spaceId, List<String> operateResourceCodes) {
        log.info("In the third party integration is enabled，check whether the sub-administrator has permissions to change permission");
        List<SpaceResourceGroupCode> disableRoleGroupCodes = getSpaceDisableResourceCodeIfSocialConnect(spaceId);
        if (CollUtil.isNotEmpty(disableRoleGroupCodes)) {
            List<String> codes = disableRoleGroupCodes.stream().map(SpaceResourceGroupCode::getCode).collect(Collectors.toList());
            ExceptionUtil.isEmpty(CollUtil.intersection(operateResourceCodes, codes), SpaceException.NO_ALLOW_OPERATE);
        }
    }
}
