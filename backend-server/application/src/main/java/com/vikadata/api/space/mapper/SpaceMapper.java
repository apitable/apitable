package com.vikadata.api.space.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.space.dto.MapDTO;
import com.vikadata.api.space.dto.BaseSpaceInfoDTO;
import com.vikadata.api.space.dto.SpaceAdminInfoDTO;
import com.vikadata.api.space.vo.SpaceVO;
import com.vikadata.entity.SpaceEntity;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SpaceMapper extends BaseMapper<SpaceEntity> {

    /**
     * @param spaceId space id
     * @return space name
     */
    String selectSpaceNameBySpaceId(@Param("spaceId") String spaceId);

    /**
     * @param spaceId space id
     * @return SpaceEntity
     */
    SpaceEntity selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * @param spaceId space id
     * @return the space infos
     */
    SpaceEntity selectBySpaceIdIgnoreDeleted(@Param("spaceId") String spaceId);

    /**
     * @param spaceIds space ids
     * @return the space infos
     */
    List<SpaceEntity> selectBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * @param userId user id
     * @return the user's space infos.
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceVO> selectListByUserId(@Param("userId") Long userId);

    /**
     * @param userId user id
     * @return the user's space amount
     */
    @InterceptorIgnore(illegalSql = "true")
    Integer getAdminSpaceCount(@Param("userId") Long userId);

    /**
     * @param spaceId space id
     * @return the main admin info
     */
    @InterceptorIgnore(illegalSql = "true")
    SpaceAdminInfoDTO selectAdminInfoDto(@Param("spaceId") String spaceId);

    /**
     * @param spaceId space id
     * @return the space's main admin member id
     */
    Long selectSpaceMainAdmin(@Param("spaceId") String spaceId);

    /**
     * gets the option argument for the space
     *
     * @param spaceId space id
     * @return props
     */
    String selectPropsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * change the spatial property state
     *
     * @param userId user id
     * @param spaceId space id
     * @param features  features
     * @return affected rows
     */
    Integer updateProps(@Param("userId") Long userId, @Param("spaceId") String spaceId, @Param("list") List<MapDTO> features);

    /**
     * change the primary administrator id of the space
     *
     * @param spaceId space id
     * @param memberId  the new main admin id
     * @param updatedBy updater
     * @return affected rows
     */
    Integer updateSpaceOwnerId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId, @Param("updatedBy") Long updatedBy);

    /**
     * remove the space main admin id
     *
     * @param spaceId space id
     * @param updatedBy updater
     * @return affected rows
     */
    int removeSpaceOwnerId(@Param("spaceId") String spaceId, @Param("updatedBy") Long updatedBy);

    /**
     * @param time      pre delete time
     * @param spaceId space id
     * @param updatedBy updater
     * @return affected rows
     */
    int updatePreDeletionTimeBySpaceId(@Param("time") LocalDateTime time, @Param("spaceId") String spaceId, @Param("updatedBy") Long updatedBy);

    /**
     * logically delete space
     *
     * @param spaceIds space ids
     * @return affected rows
     */
    int updateIsDeletedBySpaceIdIn(@Param("list") List<String> spaceIds);

    /**
     * @param spaceId space id
     * @param preDel  whether it is in the pre delete state (optional)
     * @return the space amount
     */
    Integer countBySpaceId(@Param("spaceId") String spaceId, @Param("preDel") Boolean preDel);

    /**
     * get space id by user id and the prefix and suffix of a space name
     *
     * @param userId user id
     * @param name   space name
     * @return space id
     */
    String selectSpaceIdByUserIdAndName(@Param("userId") Long userId, @Param("name") String name);

    /**
     * @param spaceIds space ids
     * @return space base info
     */
    List<BaseSpaceInfoDTO> selectBaseSpaceInfo(@Param("spaceIds") List<String> spaceIds);

    /**
     * @param userId user id
     * @return space info
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceEntity> selectByUserId(@Param("userId") Long userId);
}
