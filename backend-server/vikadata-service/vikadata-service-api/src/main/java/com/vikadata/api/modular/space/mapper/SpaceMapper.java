package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.model.dto.base.MapDTO;
import com.vikadata.api.model.dto.space.BaseSpaceInfoDto;
import com.vikadata.api.model.dto.space.SpaceAdminInfoDto;
import com.vikadata.api.model.vo.space.SpaceVO;
import com.vikadata.entity.SpaceEntity;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 空间表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2019-10-07
 */
public interface SpaceMapper extends BaseMapper<SpaceEntity> {

    /**
     * 根据空间ID查询空间名称
     *
     * @param spaceId 空间ID
     * @return 空间名称
     * @author Shawn Deng
     * @date 2020/3/30 20:15
     */
    String selectSpaceNameBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 根据空间ID查询
     *
     * @param spaceId 空间ID
     * @return SpaceEntity
     * @author Shawn Deng
     * @date 2020/1/10 17:28
     */
    SpaceEntity selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 根据空间ID查询空间信息，包括已删除的空间站
     *
     * @param spaceId 空间站 ID
     * @return 空间站信息
     * @author 刘斌华
     * @date 2022-06-16 16:20:59
     */
    SpaceEntity selectBySpaceIdIgnoreDeleted(@Param("spaceId") String spaceId);

    /**
     * 根据空间ID批量查询
     *
     * @param spaceIds 空间ID
     * @return SpaceEntity
     * @author Shawn Deng
     * @date 2020/1/10 17:28
     */
    List<SpaceEntity> selectBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * 获取用户的空间列表
     *
     * @param userId 用户ID
     * @return 空间列表视图
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceVO> selectListByUserId(@Param("userId") Long userId);

    /**
     * 获取用户是主管理员的空间数量
     *
     * @param userId 用户ID
     * @return 空间数量
     * @author Chambers
     * @date 2019/11/18
     */
    @InterceptorIgnore(illegalSql = "true")
    Integer getAdminSpaceCount(@Param("userId") Long userId);

    /**
     * 获取空间主管理员的信息
     *
     * @param spaceId 空间ID
     * @return SpaceAdminInfoDto
     * @author Chambers
     * @date 2020/1/21
     */
    @InterceptorIgnore(illegalSql = "true")
    SpaceAdminInfoDto selectAdminInfoDto(@Param("spaceId") String spaceId);

    /**
     * 查询空间的主管理员ID
     *
     * @param spaceId 空间ID
     * @return 成员ID
     * @author Shawn Deng
     * @date 2020/2/13 22:17
     */
    Long selectSpaceMainAdmin(@Param("spaceId") String spaceId);

    /**
     * 获取空间的选项参数
     *
     * @param spaceId 空间ID
     * @return props
     * @author Chambers
     * @date 2021/4/8
     */
    String selectPropsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 更改空间属性状态
     *
     * @param userId    用户ID
     * @param spaceId   空间ID
     * @param features  修改的属性列表
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/8
     */
    Integer updateProps(@Param("userId") Long userId, @Param("spaceId") String spaceId, @Param("list") List<MapDTO> features);

    /**
     * 更改空间的主管理员ID
     *
     * @param spaceId   空间ID
     * @param memberId  新的成员ID
     * @param updatedBy 更新者
     * @return 修改成功条数
     * @author Shawn Deng
     * @date 2020/2/19 17:03
     */
    Integer updateSpaceOwnerId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId, @Param("updatedBy") Long updatedBy);

    /**
     * 移除空间的主管理员ID
     *
     * @param spaceId   空间ID
     * @param updatedBy 更新者
     * @return 修改成功条数
     * @author Shawn Deng
     * @date 2020/2/19 17:03
     */
    int removeSpaceOwnerId(@Param("spaceId") String spaceId, @Param("updatedBy") Long updatedBy);

    /**
     * 更改预删除时间
     *
     * @param time      预删除时间
     * @param spaceId   空间ID
     * @param updatedBy 更新者
     * @return 修改数
     * @author Chambers
     * @date 2020/3/19
     */
    int updatePreDeletionTimeBySpaceId(@Param("time") LocalDateTime time, @Param("spaceId") String spaceId, @Param("updatedBy") Long updatedBy);

    /**
     * 逻辑删除空间
     *
     * @param spaceIds 空间ID列表
     * @return 修改数
     * @author Chambers
     * @date 2019/11/21
     */
    int updateIsDeletedBySpaceIdIn(@Param("list") List<String> spaceIds);

    /**
     * 获取空间数
     *
     * @param spaceId 空间ID
     * @param preDel  是否处于预删除状态中（非必须）
     * @return 数量
     * @author Chambers
     * @date 2020/4/1
     */
    Integer countBySpaceId(@Param("spaceId") String spaceId, @Param("preDel") Boolean preDel);

    /**
     * 根据用户ID、空间名称的前后缀获取空间ID
     *
     * @param userId 用户ID
     * @param name   空间名称
     * @return 空间ID
     * @author Chambers
     * @date 2020/4/2
     */
    String selectSpaceIdByUserIdAndName(@Param("userId") Long userId, @Param("name") String name);

    /**
     * 查询space基本信息
     *
     * @param spaceIds 空间ID列表
     * @return info
     * @author zoe zheng
     * @date 2020/5/28 4:44 下午
     */
    List<BaseSpaceInfoDto> selectBaseSpaceInfo(@Param("spaceIds") List<String> spaceIds);

    /**
     * 查询用户拥有的空间
     *
     * @param userId 用户ID
     * @return 空间列表
     * @author Shawn Deng
     * @date 2020/6/22 16:42
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceEntity> selectByUserId(@Param("userId") Long userId);
}
