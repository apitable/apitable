package com.vikadata.api.modular.user.mapper;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.define.dtos.PausedUserHistoryDto;
import com.vikadata.entity.UserHistoryEntity;

/**
 * <p>
 * 用户历史记录 Mapper接口
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/12/31 14:58:33
 */
public interface UserHistoryMapper extends BaseMapper<UserHistoryEntity> {

    /**
     * 根据用户ID查询最新的注销申请记录
     *
     * @param userId 用户ID
     * @return UserHistoryEntity
     * */
    UserHistoryEntity selectLatest(@Param("userId") Long userId, @Param("userStatus") Integer userStatus);

    /**
     * 根据userId更新用户历史记录
     *
     * @param userId 用户ID
     * @param updateUser 数据记录更新者，0代表系统用户
     * @return 受影响记录数
     * */
    int updateUpdateUserByUserId(@Param("userId") Long userId, @Param("updateUser") Long updateUser);

    /**
     * 获取createdAtAfter之后的操作记录.
     * @param createdAtBefore
     * @param createdAtAfter
     * @param userStatus
     * @return
     */
    List<PausedUserHistoryDto> selectUserHistoryDtos(@Param("createdAtBefore") LocalDateTime createdAtBefore, @Param("createdAtAfter") LocalDateTime createdAtAfter, @Param("userStatus") Integer userStatus);


}
