package com.vikadata.api.modular.audit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.modular.audit.mapper.AuditSpaceMapper;
import com.vikadata.api.modular.audit.service.IAuditSpaceService;
import com.vikadata.entity.AuditSpaceEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户行为审计表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-24
 */
@Service
@Slf4j
public class AuditSpaceServiceImpl extends ServiceImpl<AuditSpaceMapper, AuditSpaceEntity> implements IAuditSpaceService {

}
