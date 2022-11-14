package com.vikadata.api.organization.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.organization.mapper.TagGroupMapper;
import com.vikadata.api.organization.service.ITagGroupService;
import com.vikadata.entity.TagGroupEntity;
import org.springframework.stereotype.Service;

@Service
public class TagGroupServiceImpl extends ServiceImpl<TagGroupMapper, TagGroupEntity> implements ITagGroupService {

}
