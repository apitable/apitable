package com.vikadata.api.user.service;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.user.enums.UserOperationType;
import com.vikadata.api.user.model.PausedUserHistoryDto;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.entity.UserHistoryEntity;

/**
 * <p>
 * User History Service Interface
 * </p>
 */
public interface IUserHistoryService extends IService<UserHistoryEntity> {

    /**
     * Get a user's recent operation record of a certain type
     *
     * @param userId User ID
     * @param userOperationType User Operation Type
     * @return LatestUserHistoryEntity
     */
    UserHistoryEntity getLatestUserHistoryEntity(Long userId, UserOperationType userOperationType);

    /**
     * Verify whether the user can log off
     *
     * @param userId User ID
     * @return boolean True allowed, false not allowed
     * */
    boolean checkAccountAllowedToBeClosed(Long userId);

    /**
     * Add user operation records and retain all user data
     *
     * @param user User
     * @param userOperationType User Operation Type
     * @return Number of rows affected
     */
    int create(UserEntity user, UserOperationType userOperationType);

    /**
     * Add user operation records and customize the data to be retained
     *
     * @param userHistory User History
     */
    void create(UserHistoryEntity userHistory);

    /**
     * Get the operation record after created At After
     *
     * @param createdAtBefore Create start time
     * @param createdAtAfter  Create end time
     * @param userOperationType User Operation Type
     * @return UserHistoryDto
     */
    List<PausedUserHistoryDto> selectUserHistoryDtos(LocalDateTime createdAtBefore
            , LocalDateTime createdAtAfter, UserOperationType userOperationType);
}
