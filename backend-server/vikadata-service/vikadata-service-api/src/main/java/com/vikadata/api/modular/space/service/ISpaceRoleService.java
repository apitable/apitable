package com.vikadata.api.modular.space.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.model.ro.space.AddSpaceRoleRo;
import com.vikadata.api.model.ro.space.UpdateSpaceRoleRo;
import com.vikadata.api.model.vo.space.SpaceRoleDetailVo;
import com.vikadata.api.model.vo.space.SpaceRoleVo;
import com.vikadata.entity.SpaceRoleEntity;

/**
 * <p>
 * 工作空间-角色表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface ISpaceRoleService extends IService<SpaceRoleEntity> {

    /**
     * 查询空间站拥有工作台管理权限的所有管理员
     * 包括空间主管理员
     *
     * @param spaceId 空间ID
     * @return 成员ID集合
     * @author Shawn Deng
     * @date 2020/5/15 11:55
     */
    List<Long> getSpaceAdminsWithWorkbenchManage(String spaceId);

    /**
     * 分页查询管理员列表
     *
     * @param spaceId 空间ID
     * @param page    分页参数
     * @return 分页结果
     * @author Shawn Deng
     * @date 2020/2/16 19:12
     */
    PageInfo<SpaceRoleVo> roleList(String spaceId, IPage<SpaceRoleVo> page);

    /**
     * 创建新角色
     *
     * @param spaceId 空间ID
     * @return SpaceRoleEntity
     * @author Shawn Deng
     * @date 2020/2/13 21:26
     */
    SpaceRoleEntity create(String spaceId);

    /**
     * 添加角色
     *
     * @param spaceId 空间ID
     * @param data    请求参数
     * @author Shawn Deng
     * @date 2020/2/13 19:58
     */
    void createRole(String spaceId, AddSpaceRoleRo data);

    /**
     * 检查成员在空间内是否不是子管理员
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2020/2/14 00:36
     */
    void checkIsNotSubAdmin(String spaceId, Long memberId);

    /**
     * 检查成员在空间内是否是子管理员
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2020/2/14 00:36
     */
    void checkIsSubAdmin(String spaceId, Long memberId);

    /**
     * 检查添加新管理员前置条件
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2020/2/19 16:06
     */
    void checkBeforeCreate(String spaceId, Long memberId);

    /**
     * 获取管理员信息
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return SpaceRoleDetailVo
     * @author Shawn Deng
     * @date 2020/2/15 23:50
     */
    SpaceRoleDetailVo getRoleDetail(String spaceId, Long memberId);

    /**
     * 编辑管理员
     *
     * @param spaceId 空间ID
     * @param data    请求参数
     * @author Shawn Deng
     * @date 2020/2/19 16:13
     */
    void edit(String spaceId, UpdateSpaceRoleRo data);

    /**
     * 删除角色
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2020/2/16 22:26
     */
    void deleteRole(String spaceId, Long memberId);

    /**
     * 根据成员ID删除
     *
     * @param spaceId   空间ID
     * @param memberIds 成员ID集合
     * @author Shawn Deng
     * @date 2020/6/20 11:03
     */
    void batchRemoveByMemberIds(String spaceId, List<Long> memberIds);

    /**
     * 删除空间的子管理员
     *
     * @param spaceId 空间ID
     * @author Shawn Deng
     * @date 2020/12/18 12:34
     */
    void deleteBySpaceId(String spaceId);

    /**
     * 检查资源权限赋予子管理员是否包含禁用权限
     *
     * @param spaceId              空间ID
     * @param operateResourceCodes 变更的资源编码
     * @author Shawn Deng
     * @date 2020/12/18 12:27
     */
    void checkAdminResourceChangeAllow(String spaceId, List<String> operateResourceCodes);
}
