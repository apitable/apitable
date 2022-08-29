package com.vikadata.api.modular.organization.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.modular.organization.mapper.TagMemberRelMapper;
import com.vikadata.api.modular.organization.service.ITagMemberRelService;
import com.vikadata.entity.TagMemberRelEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 组织架构-部门成员关联表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2019-11-18
 */
@Service
@Slf4j
public class TagMemberRelServiceImpl extends ServiceImpl<TagMemberRelMapper, TagMemberRelEntity> implements ITagMemberRelService {

}
