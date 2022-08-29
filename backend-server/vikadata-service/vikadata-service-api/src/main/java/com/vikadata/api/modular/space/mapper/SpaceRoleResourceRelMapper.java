package com.vikadata.api.modular.space.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SpaceRoleResourceRelEntity;

/**
 * <p>
 * 工作空间-角色权限资源关联表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface SpaceRoleResourceRelMapper extends BaseMapper<SpaceRoleResourceRelEntity> {

    /**
     * 快速批量插入
     *
     * @param entities 实体对象集合
     * @return 插入成功结果数
     * @author Shawn Deng
     * @date 2020/2/13 21:32
     */
    int insertBatch(@Param("entities") List<SpaceRoleResourceRelEntity> entities);

    /**
     * 根据角色编码删除角色
     *
     * @param roleCode 角色编码
     * @return 删除结果数
     * @author Shawn Deng
     * @date 2020/2/16 15:26
     */
    int deleteByRoleCode(@Param("roleCode") String roleCode);

    /**
     * 根据资源编码删除
     *
     * @param roleCode      角色编码
     * @param resourceCodes 资源编码集合
     * @return 删除结果数
     * @author Shawn Deng
     * @date 2020/2/16 14:23
     */
    int deleteByRoleCodeAndResourceCodes(@Param("roleCode") String roleCode, @Param("resourceCodes") List<String> resourceCodes);

    /**
     * 根据资源编码查询角色编码
     *
     * @param resourceCodes
     * @return
     * @author zoe zheng
     * @date 2020/5/26 11:07 上午
     */
    List<String> selectRoleCodeByResourceCodes(@Param("resourceCodes") List<String> resourceCodes);

    /**
     * （批量）根据角色编码删除
     *
     * @param roleCodes 角色编码
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/6/20 10:55
     */
    int batchDeleteByRoleCodes(@Param("roleCodes") List<String> roleCodes);

    /**
     * 根据角色编码返回资源编码集
     *
     * @param roleCode 角色编码
     * @return 资源编码集
     */
    List<String> selectResourceCodesByRoleCode(@Param("roleCode") String roleCode);
}
