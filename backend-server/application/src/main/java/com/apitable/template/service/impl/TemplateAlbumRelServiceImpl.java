package com.apitable.template.service.impl;

import com.apitable.template.entity.TemplateAlbumRelEntity;
import com.apitable.template.mapper.TemplateAlbumRelMapper;
import com.apitable.template.service.ITemplateAlbumRelService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * template album relation service implement.
 */
@Service
public class TemplateAlbumRelServiceImpl
    extends ServiceImpl<TemplateAlbumRelMapper, TemplateAlbumRelEntity>
    implements ITemplateAlbumRelService {
}
