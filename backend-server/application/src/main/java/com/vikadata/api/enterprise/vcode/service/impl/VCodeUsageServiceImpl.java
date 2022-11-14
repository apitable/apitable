package com.vikadata.api.enterprise.vcode.service.impl;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.vcode.mapper.VCodeUsageMapper;
import com.vikadata.api.enterprise.vcode.service.IVCodeUsageService;
import com.vikadata.api.enterprise.vcode.dto.VCodeDTO;
import com.vikadata.entity.CodeUsageEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * VCode Usage Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class VCodeUsageServiceImpl implements IVCodeUsageService {

    @Resource
    private VCodeUsageMapper vCodeUsageMapper;

    @Override
    public void createUsageRecord(Long operator, String name, Integer type, String code) {
        log.info("User「{}」({}) create VCode usage record. Type:{},Code:{}", name, operator, type, code);
        CodeUsageEntity usage = CodeUsageEntity.builder()
                .type(type)
                .code(code)
                .operator(operator)
                .operatorName(name)
                .build();
        vCodeUsageMapper.insert(usage);
    }

    @Override
    public VCodeDTO getInvitorUserId(Long userId) {
        return vCodeUsageMapper.selectInvitorUserId(userId);
    }
}
