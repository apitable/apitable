package com.vikadata.api.modular.control.mapper;

import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.control.ControlType;
import com.vikadata.api.modular.control.model.ControlTypeDTO;
import com.vikadata.api.modular.control.model.ControlUnitDTO;
import com.vikadata.entity.ControlEntity;

/**
 * 权限控制表 mapper
 * @author Shawn Deng
 * @date 2021-04-01 19:33:48
 */
public interface ControlMapper extends BaseMapper<ControlEntity> {

    /**
     * 根据controlId查询实体
     * @param controlId 控制单元ID
     * @return ControlEntity
     * @author Shawn Deng
     * @date 2021/6/9 17:21
     */
    ControlEntity selectByControlId(@Param("controlId") String controlId);

    /**
     * 批量根据controlId查询实体
     * @param controlIds 控制单元ID列表
     * @return ControlEntity List
     * @author Shawn Deng
     * @date 2021/6/9 17:21
     */
    List<ControlEntity> selectByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * 查询指定控制单元的数量
     *
     * @param controlId 控制单元ID
     * @return count
     * @author Chambers
     * @date 2021/4/27
     */
    Integer selectCountByControlId(@Param("controlId") String controlId);

    /**
     * 查询权限控制单元ID
     *
     * @param prefix    控制单元ID 前缀
     * @param type      控制单元类型
     * @return 控制单元ID
     * @author Chambers
     * @date 2021/4/14
     */
    List<String> selectControlIdByControlIdPrefixAndType(@Param("prefix") String prefix, @Param("type") Integer type);

    /**
     * 查询控制单元ID
     *
     * @param controlIds 控制单元ID 集合
     * @return 控制单元ID
     * @author Chambers
     * @date 2021/4/30
     */
    List<String> selectControlIdByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * 查询权限控制单元和组织单元信息
     *
     * @param controlIds 控制单元ID 集合
     * @return ControlUnitDTO
     * @author Chambers
     * @date 2021/6/7
     */
    @InterceptorIgnore(illegalSql = "true")
    List<ControlUnitDTO> selectOwnerControlUnitDTO(@Param("controlIds") List<String> controlIds);

    /**
     * 查询权限控制单元及类型DTO
     *
     * @param spaceId   空间ID
     * @return ControlTypeDTO
     * @author Chambers
     * @date 2021/12/29
     */
    List<ControlTypeDTO> selectControlTypeDTO(@Param("spaceId") String spaceId);

    /**
     * 批量插入
     *
     * @param entities 实体集合
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/27
     */
    int insertBatch(@Param("entities") List<ControlEntity> entities);

    /**
     * 删除指定控制单元
     *
     * @param controlIds 控制单元ID 集合
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/27
     */
    int deleteByControlIds(@Param("userId") Long userId, @Param("controlIds") List<String> controlIds);

    /**
     * 查询空间control
     *
     * @param controlId 控制单元ID
     * @param spaceId 空间ID
     * @param controlType 权限类型
     * @return ControlEntity
     * @author zoe zheng
     * @date 2022/2/28 23:08
     */
    ControlEntity selectDeletedByControlIdAndSpaceId(@Param("controlId") String controlId, @Param("spaceId") String spaceId,
            @Param("controlType") ControlType controlType);

    /**
     * 更新删除状态
     *
     * @param userId 修改用户ID
     * @param ids 主键ID
     * @param isDeleted 删除状态
     * @return Integer
     * @author zoe zheng
     * @date 2022/3/1 00:25
     */
    Integer updateIsDeletedByIds(@Param("ids") List<Long> ids, @Param("userId") Long userId, @Param("isDeleted") Boolean isDeleted);
}
