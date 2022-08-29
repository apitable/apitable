package com.vikadata.api.component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.lang.ResourceDefinition;

import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

/**
 * <p>
 * 默认权限资源工厂(内存)
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/5 17:33
 */
@Slf4j
@Service
public class DefaultApiResourceFactory implements ApiResourceFactory {

    /**
     * 以资源编码为标识的存放
     */
    private final Map<String, ResourceDefinition> resourceDefinitions = new ConcurrentHashMap<>();

    /**
     * 以模块名(控制器名),资源编码为标识的存放
     */
    private final Map<String, Map<String, ResourceDefinition>> modularResourceDefinitions = new ConcurrentHashMap<>();

    /**
     * 模块名 - 模块名称
     */
    private final Map<String, String> resourceModularDict = new HashMap<>(16);

    /**
     * 资源url为标识存放资源声明
     */
    private final Map<String, ResourceDefinition> urlDefineResources = new ConcurrentHashMap<>();

    @Override
    public synchronized void registerDefinition(List<ResourceDefinition> apiResource) {
        if (CollUtil.isNotEmpty(apiResource)) {
            for (ResourceDefinition resourceDefinition : apiResource) {
                ResourceDefinition alreadyFlag = resourceDefinitions.get(resourceDefinition.getResourceCode());
                if (alreadyFlag != null) {
                    throw new RuntimeException("资源扫描过程中存在重复资源！\n新资源为： " + resourceDefinition);
                }
                resourceDefinitions.put(resourceDefinition.getResourceCode(), resourceDefinition);
                urlDefineResources.put(resourceDefinition.getResourceUrl(), resourceDefinition);

                //存储模块化资源列表
                Map<String, ResourceDefinition> modularResources = modularResourceDefinitions.get(StrUtil.toUnderlineCase(resourceDefinition.getModularCode()));
                if (modularResources == null) {
                    modularResources = CollUtil.newHashMap();
                    modularResources.put(resourceDefinition.getResourceCode(), resourceDefinition);
                    modularResourceDefinitions.put(StrUtil.toUnderlineCase(resourceDefinition.getModularCode()), modularResources);
                } else {
                    modularResources.put(resourceDefinition.getResourceCode(), resourceDefinition);
                }

                //添加资源code-中文名称字典
                this.registerModular(resourceDefinition.getResourceCode(), resourceDefinition.getResourceName());
            }
        }
    }

    @Override
    public ResourceDefinition getResource(String resourceCode) {
        return resourceDefinitions.get(resourceCode);
    }

    @Override
    public List<ResourceDefinition> getAllResources() {
        Set<Map.Entry<String, ResourceDefinition>> entries = resourceDefinitions.entrySet();
        ArrayList<ResourceDefinition> resourceDefinitions = new ArrayList<>();
        for (Map.Entry<String, ResourceDefinition> entry : entries) {
            resourceDefinitions.add(entry.getValue());
        }
        return resourceDefinitions;
    }

    @Override
    public List<ResourceDefinition> getResourcesByModularCode(String resourceCode) {
        Map<String, ResourceDefinition> stringResourceDefinitionMap = modularResourceDefinitions.get(resourceCode);
        ArrayList<ResourceDefinition> resourceDefinitions = new ArrayList<>();
        for (String key : stringResourceDefinitionMap.keySet()) {
            ResourceDefinition resourceDefinition = stringResourceDefinitionMap.get(key);
            resourceDefinitions.add(resourceDefinition);
        }
        return resourceDefinitions;
    }

    @Override
    public String getModularNameByCode(String modularCode) {
        return resourceModularDict.get(modularCode);
    }

    @Override
    public void registerModular(String modularCode, String modularName) {
        resourceModularDict.putIfAbsent(modularCode, modularName);
    }

    @Override
    public Map<String, Map<String, ResourceDefinition>> getModularResources() {
        return this.modularResourceDefinitions;
    }

    @Override
    public String getResourceUrlByCode(String resourceCode) {
        ResourceDefinition resourceDefinition = this.resourceDefinitions.get(resourceCode);
        if (resourceDefinition == null) {
            return null;
        } else {
            return resourceDefinition.getResourceUrl();
        }
    }

    @Override
    public ResourceDefinition getResourceByUrl(String resourceUrl) {
        PathMatcher matcher = new AntPathMatcher();
        Set<String> keys = this.urlDefineResources.keySet();
        String url = CollUtil.findOne(keys, key -> matcher.match(key, resourceUrl));
        return StrUtil.isNotEmpty(url) ? this.urlDefineResources.get(url) : null;
    }

    @Override
    public void clear() {
        resourceDefinitions.clear();
        modularResourceDefinitions.clear();
        resourceModularDict.clear();
        urlDefineResources.clear();
    }
}
