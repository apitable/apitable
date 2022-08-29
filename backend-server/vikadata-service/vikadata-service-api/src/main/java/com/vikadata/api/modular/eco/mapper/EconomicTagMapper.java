package com.vikadata.api.modular.eco.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.EconomicTagEntity;

/**
 * 订阅 标签表 Mapper
 * @author Shawn Deng
 * @date 2021-11-10 15:20:29
 */
public interface EconomicTagMapper extends BaseMapper<EconomicTagEntity> {

    /**
     * 查询对象标识
     * @param objectId 对象标识
     * @return EconomicTagEntity List
     */
    List<EconomicTagEntity> selectByObjectId(@Param("objectId") String objectId);

    /**
     * 查询对象标识
     * @param objectIds 对象标识列表
     * @return EconomicTagEntity List
     */
    List<EconomicTagEntity> selectByObjectIds(@Param("objectIds") List<String> objectIds);

    /**
     * 查询对象标识
     * @param tagId 标签标识
     * @param objectIds 对象标识列表
     * @return EconomicTagEntity List
     */
    List<EconomicTagEntity> selectByTagIdAndObjectIds(@Param("tagId") String tagId, @Param("objectIds") List<String> objectIds);

    /**
     * 根据标签和对象查询总数
     * @param objectId 对象标识
     * @param tagId 标签标识
     * @return 总数
     */
    Integer selectCountByObjectIdAndTagId(@Param("objectId") String objectId, @Param("tagId") String tagId);
}
