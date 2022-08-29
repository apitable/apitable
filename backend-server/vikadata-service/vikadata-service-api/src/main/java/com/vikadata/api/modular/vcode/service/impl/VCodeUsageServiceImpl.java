package com.vikadata.api.modular.vcode.service.impl;

import com.vikadata.api.model.dto.vcode.VCodeDTO;
import com.vikadata.api.modular.vcode.mapper.VCodeUsageMapper;
import com.vikadata.api.modular.vcode.service.IVCodeUsageService;
import com.vikadata.entity.CodeUsageEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * <p>
 * V 码记录 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/9/28
 */
@Slf4j
@Service
public class VCodeUsageServiceImpl implements IVCodeUsageService {

    @Resource
    private VCodeUsageMapper vCodeUsageMapper;

    @Override
    public void createUsageRecord(Long operator, String name, Integer type, String code) {
        log.info("创建 V 码记录，operator:{}，name:{}，type:{}，code:{}", operator, name, type, code);
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
