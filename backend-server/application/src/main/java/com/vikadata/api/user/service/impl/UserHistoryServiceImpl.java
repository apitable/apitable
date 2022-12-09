package com.vikadata.api.user.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.compress.utils.Lists;

import com.vikadata.api.user.enums.UserOperationType;
import com.vikadata.api.organization.dto.SpaceMemberDTO;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.user.mapper.UserHistoryMapper;
import com.vikadata.api.user.service.IUserHistoryService;
import com.vikadata.api.user.model.PausedUserHistoryDto;
import com.vikadata.api.organization.entity.MemberEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.entity.UserHistoryEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * User History Service Class
 * </p>
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
        // Get all spaces managed by users
        List<MemberEntity> memberEntities = memberMapper.selectByUserId(userId);
        if (memberEntities.size() == 0) return true;
        List<Long> memberIds = memberEntities.stream().map(memberEntity -> memberEntity.getId()).collect(Collectors.toList());
        List<SpaceEntity> spaceEntities = spaceMapper.selectByUserId(userId);
        // Find out the main managed space
        List<String> spaceIdsInMainAdmin = spaceEntities.stream().filter(space-> memberIds.contains(space.getOwner()))
                .map(memberEntity -> memberEntity.getSpaceId()).collect(Collectors.toList());
        if (spaceIdsInMainAdmin.size() == 0) return true;
        // Get all space members
        List<SpaceMemberDTO> memberDtos = memberMapper.selectMembersBySpaceIds(spaceIdsInMainAdmin);
        // Classify space members
        Map<String, List<SpaceMemberDTO>> spaceMemberDtos = memberDtos.stream()
                .collect(Collectors.groupingBy(SpaceMemberDTO::getSpaceId));
        for (Map.Entry<String, List<SpaceMemberDTO>> entry : spaceMemberDtos.entrySet()) {
            // When managing a space station with more than one member, you are not allowed to cancel the account
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
