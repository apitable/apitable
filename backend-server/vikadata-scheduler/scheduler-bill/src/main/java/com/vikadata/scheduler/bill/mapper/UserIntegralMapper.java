package com.vikadata.scheduler.bill.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IntegralHistoryEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.scheduler.bill.model.UserDTO;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/17 19:04
 */
@Mapper
public interface UserIntegralMapper {

    /**
     * 根据手机号查询用户
     *
     * @param phone 手机号
     * @return 用户对象
     * @author Shawn Deng
     * @date 2020/9/17 19:06
     */
    UserEntity selectByPhone(@Param("phone") String phone);

    /**
     * 记录积分操作
     *
     * @param entity 实体对象
     * @return 执行成功数
     * @author Shawn Deng
     * @date 2020/9/17 19:57
     */
    int insertHistory(@Param("entity") IntegralHistoryEntity entity);

    /**
     * 查找用户最大积分值
     *
     * @param userId 用户ID
     * @return 积分值
     * @author Shawn Deng
     * @date 2020/9/16 15:00
     */
    Integer selectTotalIntegralValueByUserId(@Param("userId") Long userId);

    /**
     * 批量保存积分变更历史
     *
     * @param entities 实体对象列表
     * @return 执行结果数
     * @author Chambers
     * @date 2021/8/30
     */
    int insertBatch(@Param("entities") List<IntegralHistoryEntity> entities);

    /**
     * 查询 UserDTO
     *
     * @return UserDTO
     * @param phones 手机号码列表
     * @author Chambers
     * @date 2022/3/17
     */
    List<UserDTO> selectDTOByMobilePhone(@Param("phones") List<String> phones);

    /**
     * 查询 UserDTO
     *
     * @return UserDTO
     * @param emails 邮箱列表
     * @author Chambers
     * @date 2022/3/17
     */
    List<UserDTO> selectDTOByEmail(@Param("emails") List<String> emails);
}
