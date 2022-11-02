package com.vikadata.api.modular.organization.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.entity.AuditUploadParseRecordEntity;
import com.vikadata.api.modular.audit.mapper.AuditUploadParseRecordMapper;
import com.vikadata.api.modular.organization.service.IUploadParseRecordService;
import org.springframework.stereotype.Service;

@Service
public class UploadParseRecordServiceImpl extends ServiceImpl<AuditUploadParseRecordMapper, AuditUploadParseRecordEntity> implements IUploadParseRecordService {

}
