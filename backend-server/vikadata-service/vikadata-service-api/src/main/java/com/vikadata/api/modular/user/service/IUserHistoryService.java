package com.vikadata.api.modular.user.service;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.user.UserOperationType;
import com.vikadata.define.dtos.PausedUserHistoryDto;
import com.vikadata.entity.UserEntity;
import com.vikadata.entity.UserHistoryEntity;

/**
 * <p>
 * 用户历史记录 服务接口
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/12/31 14:59:55
 */
public interface IUserHistoryService extends IService<UserHistoryEntity> {

    /**
     * 获取用户最近某个类型的一条操作记录
     * @param userId
     * @param userOperationType
     * @return
     */
    UserHistoryEntity getLatestUserHistoryEntity(Long userId, UserOperationType userOperationType);

    /**
     * 校验用户是否可以注销
     *
     * @param userId 用户ID
     * @return boolean 允许为true，不允许为false
     * */
    boolean checkAccountAllowedToBeClosed(Long userId);

    /**
     * 新增用户操作记录, 保留User所有数据.
     *
     * @param user
     * @param userOperationType
     * @return
     */
    int create(UserEntity user, UserOperationType userOperationType);

    /**
     * 新增用户操作记录，自定义需要保留的数据.
     * @param userHistory
     */
    void create(UserHistoryEntity userHistory);

    /**
     * 获取createdAtAfter之后的操作记录.
     * @param createdAtAfter
     * @param userOperationType
     * @return
     */
    List<PausedUserHistoryDto> selectUserHistoryDtos(LocalDateTime createdAtBefore
            , LocalDateTime createdAtAfter, UserOperationType userOperationType);
}
