package com.vikadata.api.space.mapper;

import com.vikadata.api.space.dto.SpaceApplyDTO;
import com.vikadata.entity.SpaceApplyEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SpaceApplyMapper {

    /**
     * @param createdBy creator
     * @param spaceId   space id
     * @param status    status
     * @return the row count
     */
    Integer countBySpaceIdAndCreatedByAndStatus(@Param("createdBy") Long createdBy, @Param("spaceId") String spaceId, @Param("status") Integer status);

    /**
     * @param notifyId       apply notification id
     * @param toUser         apply notification receiver
     * @param templateId     apply notification template id
     * @param applyIdKey     apply notification message body apply id key
     * @param applyStatusKey apply notification message body apply status key
     * @return space apply info
     */
    SpaceApplyDTO selectSpaceApplyDto(@Param("notifyId") Long notifyId, @Param("toUser") Long toUser, @Param("templateId") String templateId,
                                      @Param("applyIdKey") String applyIdKey, @Param("applyStatusKey") String applyStatusKey);

    /**
     * @param entity apply info
     * @return affected rows
     */
    int insertApply(@Param("entity") SpaceApplyEntity entity);

    /**
     * @param applyId   applyId
     * @param status    status
     * @param updatedBy updater
     * @return affected rows
     */
    int updateStatusByApplyIdAndUpdatedBy(@Param("applyId") Long applyId, @Param("status") Integer status, @Param("updatedBy") Long updatedBy);

    /**
     * @param applicants applicants
     * @param spaceId    space id
     * @param reason     invalidate reason
     * @return affected rows
     */
    int invalidateTheApply(@Param("list") List<Long> applicants, @Param("spaceId") String spaceId, @Param("reason") Integer reason);
}
