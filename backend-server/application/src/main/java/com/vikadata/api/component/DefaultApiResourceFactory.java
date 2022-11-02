package com.vikadata.api.component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

/**
 * <p>
 * default resource factory(system memory)
 * </p>
 *
 * @author Shawn Deng
 */
@Slf4j
@Service
public class DefaultApiResourceFactory implements ApiResourceFactory {

    private final Map<String, ResourceDefinition> resourceDefinitions = new ConcurrentHashMap<>();

    private final Map<String, Map<String, ResourceDefinition>> modularResourceDefinitions = new ConcurrentHashMap<>();

    private final Map<String, ResourceDefinition> urlDefineResources = new ConcurrentHashMap<>();

    @Override
    public synchronized void registerDefinition(List<ResourceDefinition> apiResource) {
        if (CollUtil.isNotEmpty(apiResource)) {
            for (ResourceDefinition resourceDefinition : apiResource) {
                ResourceDefinition alreadyFlag = resourceDefinitions.get(resourceDefinition.getResourceCode());
                if (alreadyFlag != null) {
                    throw new RuntimeException("There are duplicate resources during resource scanning！\nNew resources are： " + resourceDefinition);
                }
                resourceDefinitions.put(resourceDefinition.getResourceCode(), resourceDefinition);
                urlDefineResources.put(resourceDefinition.getResourceUrl(), resourceDefinition);

                Map<String, ResourceDefinition> modularResources = modularResourceDefinitions.get(StrUtil.toUnderlineCase(resourceDefinition.getModularCode()));
                if (modularResources == null) {
                    modularResources = CollUtil.newHashMap();
                    modularResources.put(resourceDefinition.getResourceCode(), resourceDefinition);
                    modularResourceDefinitions.put(StrUtil.toUnderlineCase(resourceDefinition.getModularCode()), modularResources);
                } else {
                    modularResources.put(resourceDefinition.getResourceCode(), resourceDefinition);
                }
            }
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
        urlDefineResources.clear();
    }
}
