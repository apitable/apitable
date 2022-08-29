package com.vikadata.api.modular.finance.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.entity.BundleEntity;

/**
 * 订阅计费系统-订阅套餐表 Mapper
 * @author Shawn Deng
 * @date 2022-05-13 16:35:11
 */
public interface BundleMapper extends BaseMapper<BundleEntity> {

    /**
     * 查询空间订阅集合包
     * @param bundleId 订阅集合包标识
     * @return bundle list
     */
    BundleEntity selectByBundleId(@Param("bundleId") String bundleId);

    /**
     * 根据空间订阅集合包标识查询
     * @param bundleIds 订阅集合包标识列表
     * @return bundle list
     */
    List<BundleEntity> selectByBundleIds(@Param("bundleIds") List<String> bundleIds);

    /**
     * 查询空间订阅集合包
     * @param spaceId 空间ID
     * @return bundle list
     */
    List<BundleEntity> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 批量查询空间订阅集合包
     * @param spaceIds 空间ID集合
     * @return bundle list
     */
    List<BundleEntity> selectBySpaceIds(@Param("spaceIds") Collection<String> spaceIds);

    /**
     * 查询空间订阅集合包
     * @param spaceId 空间ID
     * @return bundle list
     */
    List<BundleEntity> selectBySpaceIdAndByState(@Param("spaceId") String spaceId, @Param("state") BundleState state);

    /**
     * 更新删除状态
     * @param bundleIds 订阅集合包标识
     * @param isDeleted 是否删除
     * @return 影响行数
     * @author zoe zheng
     * @date 2022/6/7 10:21
     */
    Integer updateIsDeletedByBundleIds(@Param("bundleIds") List<String> bundleIds, @Param("isDeleted") boolean isDeleted);
}
