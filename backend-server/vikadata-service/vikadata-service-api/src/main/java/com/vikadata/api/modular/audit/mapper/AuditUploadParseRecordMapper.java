package com.vikadata.api.modular.audit.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.AuditUploadParseRecordEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 通讯录-成员文件上传表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2019-12-16
 */
public interface AuditUploadParseRecordMapper extends BaseMapper<AuditUploadParseRecordEntity> {

    /**
     * 查找空间上传通讯录模板最新的解析结果
     *
     * @param spaceId 空间ID
     * @return UploadParseRecordEntity
     * @author Shawn Deng
     * @date 2019/12/18 13:52
     */
    AuditUploadParseRecordEntity selectLastBySpaceId(@Param("spaceId") String spaceId);
}
