package com.vikadata.api.modular.space.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.space.mapper.InvitationMapper;
import com.vikadata.api.modular.space.service.IInvitationService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.InvitationEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.SpaceException.NO_ALLOW_OPERATE;

/**
 * <p>
 * space--invitation service implementation
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
 */
@Slf4j
@Service
public class InvitationServiceImpl extends ServiceImpl<InvitationMapper, InvitationEntity> implements IInvitationService {
    @Resource
    private InvitationMapper invitationMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private INodeService iNodeService;

    @Override
    public void closeMemberInvitationStatusBySpaceId(String spaceId) {
        invitationMapper.updateStatusBySpaceIdAndNodeIdNotEmpty(spaceId, false);
    }

    @Override
    public String getMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId) {
        // whether members can invite other users
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        ExceptionUtil.isTrue(feature.getInvitable(), NO_ALLOW_OPERATE);
        // check if node exists and doesn't span spaces
        iNodeService.checkNodeIfExist(spaceId, nodeId);
        // teamId must be root teamId, so there is no need to query by teamId
        InvitationEntity entity = invitationMapper.selectByMemberIdAndSpaceIdAndNodeId(memberId, spaceId, nodeId);
        if (entity == null) {
            return this.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        }
        if (!entity.getStatus()) {
            entity.setInviteToken(IdUtil.fastSimpleUUID());
            entity.setStatus(true);
            invitationMapper.updateById(entity);
        }
        return entity.getInviteToken();
    }

    @Override
    public String createMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId) {
        String token = IdUtil.fastSimpleUUID();
        InvitationEntity entity = InvitationEntity.builder()
                .spaceId(spaceId)
                .teamId(teamMapper.selectRootIdBySpaceId(spaceId))
                .creator(memberId)
                .inviteToken(token)
                .nodeId(nodeId)
                .build();
        invitationMapper.insert(entity);
        return token;
    }
}
