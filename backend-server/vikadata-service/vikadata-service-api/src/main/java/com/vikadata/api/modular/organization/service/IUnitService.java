package com.vikadata.api.modular.organization.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.model.vo.organization.UnitInfoVo;
import com.vikadata.api.modular.organization.model.UnitInfoDTO;
import com.vikadata.entity.UnitEntity;

/**
 * <p>
 * 组织单元 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/10 14:19
 */
public interface IUnitService extends IService<UnitEntity> {

    /**
     * 根据关联ID，获取组织单元ID
     *
     * @param refId 单元关联ID
     * @return unitId
     * @author Chambers
     * @date 2021/5/24
     */
    Long getUnitIdByRefId(Long refId);

    /**
     * 根据关联ID集合获取组织单元ID集合
     *
     * @param refIds 单元关联ID集合
     * @return 组织单元ID集合
     * @author Shawn Deng
     * @date 2020/3/2 12:37
     */
    List<Long> getUnitIdsByRefIds(Collection<Long> refIds);

    /**
     * 根据关联ID集合，批量获取组织单元
     *
     * @param refIds 单元关联ID集合
     * @return 组织单元集合
     * @author Chambers
     * @date 2021/4/19
     */
    List<UnitEntity> getByRefIds(Collection<Long> refIds);

    /**
     * 检查组织单元是否在空间内
     *
     * @param spaceId 空间ID
     * @param unitIds 组织单元ID集合
     * @author Shawn Deng
     * @date 2020/3/5 20:26
     */
    void checkInSpace(String spaceId, List<Long> unitIds);

    /**
     * 创建组织单元
     *
     * @param spaceId   空间ID
     * @param unitType  单元类型
     * @param unitRefId 单元关联ID
     * @return 组织单元ID
     * @author Shawn Deng
     * @date 2020/1/10 14:57
     */
    Long create(String spaceId, UnitType unitType, Long unitRefId);

    /**
     * 批量插入组织单元
     *
     * @param unitEntities 实体集合
     * @return 是否成功
     * @author Shawn Deng
     * @date 2020/1/14 15:07
     */
    boolean createBatch(List<UnitEntity> unitEntities);

    /**
     * 批量恢复组织单元
     *
     * @param spaceId   空间ID
     * @param memberIds 成员ID列表
     * @author Shawn Deng
     * @date 2020/6/19 20:55
     */
    void restoreMemberUnit(String spaceId, Collection<Long> memberIds);

    /**
     * 删除空间内的部门组织单元
     *
     * @param teamId 部门ID
     * @author Shawn Deng
     * @date 2020/1/11 11:07
     */
    void removeByTeamId(Long teamId);

    /**
     * 批量删除部门组织单元
     *
     * @param teamIds 部门ID集合
     * @author Shawn Deng
     * @date 2020/12/14 14:42
     */
    void batchRemoveByTeamId(List<Long> teamIds);

    /**
     * 删除空间内的成员组织单元
     *
     * @param memberIds 成员ID
     * @author Shawn Deng
     * @date 2020/1/11 11:07
     */
    void removeByMemberId(List<Long> memberIds);

    /**
     * 查询组织单元视图
     *
     * @param spaceId 空间ID
     * @param unitIds 组织单元ID列表
     * @return UnitInfoVo List
     * @author Shawn Deng
     * @date 2021/1/6 18:44
     */
    List<UnitInfoVo> getUnitInfoList(String spaceId, List<Long> unitIds);

    /**
     * 获取组织单元下所有的成员ID（包括部门）
     *
     * @param unitIds   组织单元ID列表
     * @return MemberIds
     * @author Chambers
     * @date 2021/4/16
     */
    List<Long> getMembersIdByUnitIds(Collection<Long> unitIds);

    /**
     * 批量更新组织的isDeleted单元
     * @param spaceId 空间站ID
     * @param refIds 关联ID
     * @param unitType 组织单元类型
     * @param isDeleted 是否删除
     * @return boolean
     * @author zoe zheng
     * @date 2022/4/26 10:34
     */
    boolean batchUpdateIsDeletedBySpaceIdAndRefId(String spaceId, List<Long> refIds, UnitType unitType, Boolean isDeleted);

    /**
     * 获取组织单元信息DTO
     *
     * @param unitIds   组织单元ID列表
     * @return UnitInfoDTO
     * @author Chambers
     * @date 2022/6/6
     */
    List<UnitInfoDTO> getUnitInfoDTOByUnitIds(List<Long> unitIds);

    /**
     * 获取组织单元相关联的所有用户ID
     *
     * @param unitIds   组织单元ID列表
     * @return userIds
     * @author Chambers
     * @date 2022/6/24
     */
    List<Long> getRelUserIdsByUnitIds(List<Long> unitIds);

    /**
     *  Delete the unit by team id / role id / member id
     *
     * @param refId     team id / role id / member id
     */
    void removeByRefId(Long refId);

    /**
     * get unit entity by refs' id
     *
     * @param refIds the refs' id
     * @return the unit entities
     */
    List<UnitEntity> getUnitEntitiesByUnitRefIds(List<Long> refIds);
}
