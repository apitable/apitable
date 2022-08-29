package com.vikadata.api.component;

import com.vikadata.api.lang.ResourceDefinition;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 权限资源生产工厂
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/5 17:27
 */
public interface ApiResourceFactory {

    /**
     * 注册资源列表
     * 同步锁，以防并发数据
     *
     * @param apiResource 资源列表
     * @author Shawn Deng
     * @date 2018/11/5 17:20
     */
    void registerDefinition(List<ResourceDefinition> apiResource);

    /**
     * 通过编码获取资源
     *
     * @param resourceCode 资源编码
     * @return ResourceDefinition 资源实体
     * @author Shawn Deng
     * @date 2018/11/5 17:20
     */
    ResourceDefinition getResource(String resourceCode);

    /**
     * 获取当前应用所有资源
     *
     * @return 资源列表
     * @author Shawn Deng
     * @date 2018/11/5 17:21
     */
    List<ResourceDefinition> getAllResources();

    /**
     * 通过模块编码获取资源
     *
     * @param modularCode 模块编码
     * @return 资源列表
     * @author Shawn Deng
     * @date 2018/11/5 17:21
     */
    List<ResourceDefinition> getResourcesByModularCode(String modularCode);

    /**
     * 通过模块编码获取模块名称
     *
     * @param modularCode 模块编码
     * @return 模块名称
     * @author Shawn Deng
     * @date 2018/11/5 17:23
     */
    String getModularNameByCode(String modularCode);

    /**
     * 添加资源编码和名称
     *
     * @param modularCode 资源编码
     * @param modularName 资源名称
     * @author Shawn Deng
     * @date 2018/11/5 17:23
     */
    void registerModular(String modularCode, String modularName);

    /**
     * 获取所有模块资源
     *
     * @return Map
     * @author Shawn Deng
     * @date 2018/11/5 17:25
     */
    Map<String, Map<String, ResourceDefinition>> getModularResources();

    /**
     * 通过编码获取url
     *
     * @param resourceCode 资源编码
     * @return resourceUrl
     * @author Shawn Deng
     * @date 2018/11/5 17:25
     */
    String getResourceUrlByCode(String resourceCode);

    /**
     * 通过资源url获取资源实体
     * ant表达式解析
     *
     * @param resourceUrl 资源地址
     * @return ResourceDefinition资源实体
     * @author Shawn Deng
     * @date 2018/11/5 17:26
     */
    ResourceDefinition getResourceByUrl(String resourceUrl);

    /**
     * 清空工厂数据
     *
     * @author Shawn Deng
     * @date 2018/11/10 18:21
     */
    void clear();
}
