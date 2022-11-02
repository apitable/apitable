package com.vikadata.api.component;

import java.util.List;

/**
 * <p>
 * api resource factory
 * </p>
 *
 * @author Shawn Deng
 */
public interface ApiResourceFactory {

    /**
     * register a resource into container
     *
     * @param apiResource api resource
     */
    void registerDefinition(List<ResourceDefinition> apiResource);

    /**
     * get resource by url
     *
     * @param resourceUrl url
     * @return ResourceDefinition
     */
    ResourceDefinition getResourceByUrl(String resourceUrl);

    /**
     * clear resource
     */
    void clear();
}
