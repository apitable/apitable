package com.vikadata.api.modular.statics.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.statics.model.ControlStaticsVO;
import com.vikadata.api.modular.statics.model.NodeStaticsVO;
import com.vikadata.api.modular.statics.model.NodeTypeStatics;

/**
 * <p>
 * 统计 接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/2 17:43
 */
public interface StaticsMapper {

    /**
     * 统计管理员总数
     *
     * @param spaceId 空间ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/9/2 17:46
     */
    Long countSubAdminBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 统计成员总数
     *
     * @param spaceId 空间ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/9/2 17:46
     */
    Long countMemberBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 统计小组总数
     *
     * @param spaceId 空间ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/9/2 17:46
     */
    Long countTeamBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 统计数表总数
     *
     * @param spaceId 空间ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/9/2 17:46
     */
    Long countDstBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 统计空间所有表的行数
     *
     * @param spaceId 空间ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/9/2 17:46
     */
    Long countRecordsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 统计空间内的API用量
     *
     * @param spaceId   空间ID
     * @param minId     最小ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/9/12 16:24
     */
    Long countApiUsageBySpaceId(@Param("spaceId") String spaceId, @Param("minId") Long minId);

    /**
     * 查询 API 用量表指定时间的最小表 ID
     *
     * @param minId     最小ID（非必须）
     * @param startTime 开始时间
     * @return ID
     * @author Chambers
     * @date 2021/6/18
     */
    Long selectApiUsageMinIdByCreatedAt(@Param("minId") Long minId, @Param("startTime") LocalDateTime startTime);

    /**
     * 查询最大表ID
     *
     * @return ID
     * @author Chambers
     * @date 2022/1/4
     */
    Long selectMaxId();

    /**
     * 查询空间引用资源的文件大小集合
     *
     * @param spaceId 空间ID
     * @return 文件大小
     * @author Shawn Deng
     * @date 2021/1/6 15:43
     */
    List<Integer> selectFileSizeBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间内设置的列权限大小
     * @param spaceId 空间ID
     * @return 数量
     */
    ControlStaticsVO countFieldControlBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询节点统计
     * @param spaceId 空间ID
     * @return 数量
     */
    NodeStaticsVO selectNodeStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询节点类型统计列表
     * @param spaceId 空间ID
     * @return 节点类型统计
     */
    List<NodeTypeStatics> selectNodeTypeStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间所有数表的视图统计
     * @param spaceId 空间ID
     * @return 数量
     */
    List<String> selectDstViewStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询某天API用量最大表ID
     *
     * @param time 时间
     * @return id 表ID
     * @author liuzijing
     * @date 2022/6/14
     */
    Long selectMaxIdByTime(@Param("time") String time);

    /**
     * 查询空间站某天API用量
     *
     * @param id 表ID
     * @param spaceId 空间ID
     * @return 数量
     * @author liuzijing
     * @date 2022/6/14
     */
    Long countByIdGreaterThanAndSpaceId(@Param("id") Long id, @Param("spaceId") String spaceId);

    /**
     * 查询空间站某段时间API用量
     *
     * @param spaceId 空间ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 数量
     * @author liuzijing
     * @date 2022/6/14
     */
    Long selectTotalSumBySpaceIdAndTimeBetween(@Param("spaceId") String spaceId, @Param("startTime") String startTime, @Param("endTime") String endTime);
}
