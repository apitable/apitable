package com.vikadata.scheduler.space.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.xxl.job.core.context.XxlJobHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.entity.TemplatePropertyEntity;
import com.vikadata.entity.TemplatePropertyRelEntity;
import com.vikadata.scheduler.space.mapper.template.TemplatePropertyMapper;
import com.vikadata.scheduler.space.mapper.template.TemplatePropertyRelMapper;
import com.vikadata.scheduler.space.model.CategoryDto;
import com.vikadata.scheduler.space.service.ITemplateService;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 模版服务实现类
 * </p>
 * @author zoe zheng
 * @date 2021/8/10 5:28 下午
 */
@Service
@Slf4j
public class TemplateServiceImpl implements ITemplateService {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private TemplatePropertyMapper propertyMapper;

    @Resource
    private TemplatePropertyRelMapper propertyRelMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncTemplate() {
        List<TemplatePropertyEntity> propertyEntities = new ArrayList<>();
        List<TemplatePropertyRelEntity> relEntities = new ArrayList<>();
        String key = "vikadata:config:template:zh_CN:online";
        Object val = redisTemplate.opsForValue().get(key);
        if (val != null) {
            List<CategoryDto> dtoList = JSONUtil.parseArray(val).toList(CategoryDto.class);
            for (int i = 0; i < dtoList.size(); i++) {
                TemplatePropertyEntity property = new TemplatePropertyEntity();
                Long propertyId = IdWorker.getId();
                property.setId(propertyId);
                CategoryDto category = dtoList.get(i);
                // 分类
                property.setPropertyType(0);
                property.setPropertyCode(category.getCategoryCode());
                property.setPropertyName(category.getCategoryName());
                propertyEntities.add(property);
                for (String templateId : category.getTemplateIds()) {
                    TemplatePropertyRelEntity rel = new TemplatePropertyRelEntity();
                    rel.setId(IdWorker.getId());
                    rel.setTemplateId(templateId);
                    rel.setPropertyOrder(i);
                    rel.setPropertyId(propertyId);
                    relEntities.add(rel);
                }
            }
        }
        if (!propertyEntities.isEmpty()) {
            propertyMapper.insertBatch(propertyEntities);
            propertyRelMapper.insertBatch(relEntities);
        }
        XxlJobHelper.log("初始化模版成功. 处理数据条目:{}", propertyEntities.size());
    }
}
