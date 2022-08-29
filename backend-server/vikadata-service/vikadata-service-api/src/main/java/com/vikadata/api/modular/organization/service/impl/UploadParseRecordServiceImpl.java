package com.vikadata.api.modular.organization.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.entity.AuditUploadParseRecordEntity;
import com.vikadata.api.modular.audit.mapper.AuditUploadParseRecordMapper;
import com.vikadata.api.modular.organization.service.IUploadParseRecordService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 通讯录-成员文件上传表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2019-12-16
 */
@Service
public class UploadParseRecordServiceImpl extends ServiceImpl<AuditUploadParseRecordMapper, AuditUploadParseRecordEntity> implements IUploadParseRecordService {

}
