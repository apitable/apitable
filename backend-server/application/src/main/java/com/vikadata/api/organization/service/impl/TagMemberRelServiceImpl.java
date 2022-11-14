package com.vikadata.api.organization.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.organization.mapper.TagMemberRelMapper;
import com.vikadata.api.organization.service.ITagMemberRelService;
import com.vikadata.entity.TagMemberRelEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TagMemberRelServiceImpl extends ServiceImpl<TagMemberRelMapper, TagMemberRelEntity> implements ITagMemberRelService {

}
