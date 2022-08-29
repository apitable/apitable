package com.vikadata.api.modular.vcode.mapper;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.vo.vcode.VCodePageVo;
import com.vikadata.entity.CodeEntity;

/**
 * <p>
 * V码系统-V码表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/12
 */
public interface VCodeMapper extends BaseMapper<CodeEntity> {

    /**
     * 查询指定 vcode 数量
     *
     * @return code V 码
     * @author Chambers
     * @date 2020/8/21
     */
    Integer countByCode(@Param("code") String code);

    /**
     * 通过 V 码查询实体
     *
     * @param code V 码
     * @return entity
     * @author Chambers
     * @date 2020/8/28
     */
    CodeEntity selectByCode(@Param("code") String code);

    /**
     * 查询邀请码
     *
     * @param code V 码
     * @param type 类型
     * @return refId
     * @author Chambers
     * @date 2020/8/28
     */
    Long selectRefIdByCodeAndType(@Param("code") String code, @Param("type") Integer type);

    /**
     * 查询可使用总数
     *
     * @param code V 码
     * @return Available Times
     * @author Chambers
     * @date 2020/9/29
     */
    Integer selectAvailableTimesByCode(@Param("code") String code);

    /**
     * 查询 code
     *
     * @param type  类型
     * @param refId 关联ID
     * @return code
     * @author Chambers
     * @date 2020/8/14
     */
    String selectCodeByTypeAndRefId(@Param("type") Integer type, @Param("refId") Long refId);

    /**
     * 查询类型
     *
     * @param code V 码
     * @return type
     * @author Chambers
     * @date 2020/8/25
     */
    Integer selectTypeByCode(@Param("code") String code);

    /**
     * 修改关联ID
     *
     * @param userId 用户ID
     * @param code   V 码
     * @param refId  关联ID
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/25
     */
    int updateRefIdByCode(@Param("userId") Long userId, @Param("code") String code, @Param("refId") Long refId);

    /**
     * 修改可使用总数、剩余次数
     *
     * @param userId 用户ID
     * @param code   V 码
     * @param avail  可使用总数
     * @param remain 剩余次数
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/25
     */
    int updateAvailableTimesByCode(@Param("userId") Long userId, @Param("code") String code, @Param("avail") Integer avail, @Param("remain") Integer remain);

    /**
     * 修改单人限制使用次数
     *
     * @param userId 用户ID
     * @param code   V 码
     * @param times  限制次数
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/25
     */
    int updateLimitTimesByCode(@Param("userId") Long userId, @Param("code") String code, @Param("times") Integer times);

    /**
     * 修改过期时间
     *
     * @param userId     用户ID
     * @param code       V 码
     * @param expireTime 过期时间
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/25
     */
    int updateExpiredAtByCode(@Param("userId") Long userId, @Param("code") String code, @Param("expireTime") LocalDateTime expireTime);

    /**
     * 逻辑删除
     *
     * @param userId 用户ID
     * @param code   V 码
     * @return 变更数
     * @author Chambers
     * @date 2020/8/12
     */
    int removeByCode(@Param("userId") Long userId, @Param("code") String code);

    /**
     * 批量插入
     *
     * @param entities 实体列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/21
     */
    int insertList(@Param("entities") List<CodeEntity> entities);

    /**
     * 查询指定活动的 VCode 数量
     *
     * @param activityId 活动ID
     * @return count
     * @author Chambers
     * @date 2020/8/25
     */
    Integer countByActivityId(@Param("activityId") Long activityId);

    /**
     * 减少剩余次数
     *
     * @param code VCode
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/25
     */
    int subRemainTimes(@Param("code") String code);

    /**
     * 获取指定活动可用的 VCode
     *
     * @param activityId 活动ID
     * @return VCode
     * @author Chambers
     * @date 2020/8/25
     */
    List<String> getAvailableCode(@Param("activityId") Long activityId);

    /**
     * 获取指定操作者，在指定活动领取的 VCode
     *
     * @param activityId 活动ID
     * @param operator   V码记录操作者
     * @return VCode
     * @author Chambers
     * @date 2020/8/25
     */
    String getAcquiredCode(@Param("activityId") Long activityId, @Param("operator") Long operator);

    /**
     * 分页获取 V 码详细信息
     *
     * @param page       分页请求对象
     * @param type       类型
     * @param activityId 活动ID
     * @return info
     * @author Chambers
     * @date 2020/8/19
     */
    IPage<VCodePageVo> selectDetailInfo(Page<VCodePageVo> page, @Param("type") Integer type, @Param("activityId") Long activityId);

    /**
     * 查询兑换码的V币兑换数
     *
     * @param code V 码
     * @return V 币兑换数
     * @author Chambers
     * @date 2020/9/28
     */
    Integer selectIntegral(@Param("code") String code);
}
