package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.vikadata.api.model.vo.space.SpaceRoleVo;
import com.vikadata.entity.SpaceRoleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作空间-角色表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface SpaceRoleMapper extends BaseMapper<SpaceRoleEntity> {

    /**
     * 分页查询
     *
     * @param page    分页请求对象
     * @param spaceId 空间ID
     * @return 分页结果集
     * @author Shawn Deng
     * @date 2020/2/12 22:41
     */
    @InterceptorIgnore(illegalSql = "true")
    IPage<SpaceRoleVo> selectSpaceRolePage(IPage<SpaceRoleVo> page, @Param("spaceId") String spaceId);

    /**
     * 根据角色编码删除角色
     *
     * @param roleCode 角色编码
     * @return 结果数
     * @author Shawn Deng
     * @date 2020/2/16 15:28
     */
    int deleteByRoleCode(@Param("roleCode") String roleCode);

    /**
     * 查询角色对应资源编码集合
     *
     * @param id 成员ID
     * @return 资源编码列表
     * @author Shawn Deng
     * @date 2020/2/16 14:31
     */
    List<String> selectResourceCodesById(@Param("id") Long id);

    /**
     * (批量)根据角色编码删除角色
     *
     * @param roleCodes 角色编码
     * @return 结果数
     * @author Shawn Deng
     * @date 2020/2/16 15:28
     */
    int batchDeleteByRoleCode(@Param("roleCodes") List<String> roleCodes);
}
