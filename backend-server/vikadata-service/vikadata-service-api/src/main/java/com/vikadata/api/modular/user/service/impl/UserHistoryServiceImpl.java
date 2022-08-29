package com.vikadata.api.modular.user.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.compress.utils.Lists;

import com.vikadata.api.enums.user.UserOperationType;
import com.vikadata.api.model.dto.organization.SpaceMemberDto;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.user.mapper.UserHistoryMapper;
import com.vikadata.api.modular.user.service.IUserHistoryService;
import com.vikadata.define.dtos.PausedUserHistoryDto;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.entity.UserHistoryEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户历史记录 服务类
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/12/31 15:00:42
 */
@Service
public class UserHistoryServiceImpl extends ServiceImpl<UserHistoryMapper, UserHistoryEntity> implements IUserHistoryService {

    @Resource
    private UserHistoryMapper userHistoryMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Override
    public UserHistoryEntity getLatestUserHistoryEntity(Long userId, UserOperationType userOperationType) {
        return userHistoryMapper.selectLatest(userId, userOperationType.getStatusCode());
    }

    @Override
    // TODO: move to User Service. added by troy.
    public boolean checkAccountAllowedToBeClosed(Long userId) {
        // 获取用户管理的所有空间
        List<MemberEntity> memberEntities = memberMapper.selectByUserId(userId);
        if (memberEntities.size() == 0) return true;
        List<Long> memberIds = memberEntities.stream().map(memberEntity -> memberEntity.getId()).collect(Collectors.toList());
        List<SpaceEntity> spaceEntities = spaceMapper.selectByUserId(userId);
        // 查找出主管理的空间
        List<String> spaceIdsInMainAdmin = spaceEntities.stream().filter(space-> memberIds.contains(space.getOwner()))
                .map(memberEntity -> memberEntity.getSpaceId()).collect(Collectors.toList());
        if (spaceIdsInMainAdmin.size() == 0) return true;
        // 获取所有空间成员
        List<SpaceMemberDto> memberDtos = memberMapper.selectMembersBySpaceIds(spaceIdsInMainAdmin);
        // 分类各空间成员
        Map<String, List<SpaceMemberDto>> spaceMemberDtos = memberDtos.stream()
                .collect(Collectors.groupingBy(SpaceMemberDto::getSpaceId));
        for (Map.Entry<String, List<SpaceMemberDto>> entry : spaceMemberDtos.entrySet()) {
            // 管理了超过1个成员的空间站时，不允许注销账号
            if (entry.getValue().size() > 1) {
            // if(manageSpaceWithMultipleMembers(userId, entry.getValue())) {
                return false;
            }
        }
        return true;
    }

    @Override
    public int create(UserEntity user, UserOperationType userOperationType) {
        UserHistoryEntity userHistory = transferDataFromUser(user);
        userHistory.setUserStatus(userOperationType.getStatusCode());
        return userHistoryMapper.insert(userHistory);
    }

    private UserHistoryEntity transferDataFromUser(UserEntity user) {
        UserHistoryEntity userHistory = UserHistoryEntity.builder().userId(user.getId())
                .uuid(user.getUuid())
                .nickName(user.getNickName())
                .code(user.getCode())
                .mobilePhone(user.getMobilePhone())
                .email(user.getEmail())
                .locale(user.getLocale())
                .createdBy(user.getId())
                .updatedBy(user.getId())
                .build();
        return userHistory;
    }

    @Override
    public void create(UserHistoryEntity userHistory) {
        userHistoryMapper.insert(userHistory);
    }

    @Override
    public List<PausedUserHistoryDto> selectUserHistoryDtos(LocalDateTime createdAtBefore, LocalDateTime createdAtAfter, UserOperationType userOperationType) {
        List<PausedUserHistoryDto> userLatestHistoryDtos = Lists.newArrayList();
        List<PausedUserHistoryDto> historyDtos = userHistoryMapper.selectUserHistoryDtos(createdAtBefore, createdAtAfter
                , userOperationType.getStatusCode());
        if(historyDtos.size() == 0){
            return historyDtos;
        }
        Collections.sort(historyDtos, (h1, h2) -> h2.getCreatedAt().compareTo(h1.getCreatedAt()));

        Map<Long, List<PausedUserHistoryDto>> dtosClassifyByUserId = historyDtos.stream()
                .collect(Collectors.groupingBy(PausedUserHistoryDto::getUserId));
        for(Map.Entry<Long, List<PausedUserHistoryDto>> entry : dtosClassifyByUserId.entrySet()) {
            userLatestHistoryDtos.add(entry.getValue().get(0));
        }
        return userLatestHistoryDtos;
    }

}
