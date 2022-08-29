package com.vikadata.api.modular.space.mapper;

import com.vikadata.api.model.dto.space.SpaceApplyDto;
import com.vikadata.entity.SpaceApplyEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作空间-申请表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/10/29
 */
public interface SpaceApplyMapper {

    /**
     * 查询指定条件数量
     *
     * @param createdBy 创建者
     * @param spaceId   空间ID
     * @param status    状态
     * @return count
     * @author Chambers
     * @date 2020/11/4
     */
    Integer countBySpaceIdAndCreatedByAndStatus(@Param("createdBy") Long createdBy, @Param("spaceId") String spaceId, @Param("status") Integer status);

    /**
     * 查询申请信息
     *
     * @param notifyId       申请通知ID
     * @param toUser         申请通知接收者
     * @param templateId     申请通知模板ID
     * @param applyIdKey     申请通知消息体申请ID key
     * @param applyStatusKey 申请通知消息体申请状态 key
     * @return dto
     * @author Chambers
     * @date 2020/10/30
     */
    SpaceApplyDto selectSpaceApplyDto(@Param("notifyId") Long notifyId, @Param("toUser") Long toUser, @Param("templateId") String templateId,
                                      @Param("applyIdKey") String applyIdKey, @Param("applyStatusKey") String applyStatusKey);

    /**
     * 新增申请记录
     *
     * @param entity 实体对象
     * @return 执行结果数
     * @author Chambers
     * @date 2020/10/29
     */
    int insertApply(@Param("entity") SpaceApplyEntity entity);

    /**
     * 修改申请状态、审核人
     *
     * @param applyId   申请ID
     * @param status    状态
     * @param updatedBy 审核人
     * @return 执行结果数
     * @author Chambers
     * @date 2020/10/30
     */
    int updateStatusByApplyIdAndUpdatedBy(@Param("applyId") Long applyId, @Param("status") Integer status, @Param("updatedBy") Long updatedBy);

    /**
     * 使申请无效
     *
     * @param applicants 申请人列表
     * @param spaceId    空间ID
     * @param reason     失效原因
     * @return 执行结果数
     * @author Chambers
     * @date 2020/10/30
     */
    int invalidateTheApply(@Param("list") List<Long> applicants, @Param("spaceId") String spaceId, @Param("reason") Integer reason);
}
