package com.vikadata.api.organization.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AuditUploadParseRecordEntity;

/**
 * <p>
 * Audit Upload Parse Record Mapper*
 * </p>
 */
public interface AuditUploadParseRecordMapper extends BaseMapper<AuditUploadParseRecordEntity> {

    /**
     * Find the latest analysis result of uploading address book template
     *
     * @param spaceId space id
     * @return UploadParseRecordEntity
     */
    AuditUploadParseRecordEntity selectLastBySpaceId(@Param("spaceId") String spaceId);
}
