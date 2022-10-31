package com.vikadata.api.modular.organization.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.organization.mapper.TagMapper;
import com.vikadata.api.modular.organization.service.ITagService;
import com.vikadata.entity.TagEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TagServiceImpl extends ServiceImpl<TagMapper, TagEntity> implements ITagService {

}
