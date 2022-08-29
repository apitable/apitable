package com.vikadata.api.modular.developer.service;

/**
 * <p>
 * 开发者配置 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 15:21
 */
public interface IDeveloperService {

    /**
     * 检查用户是否已经配置
     *
     * @param userId 用户ID
     * @return true | false
     * @author Shawn Deng
     * @date 2020/5/27 18:09
     */
    boolean checkHasCreate(Long userId);

    /**
     * 校验API KEY是否有效
     *
     * @param apiKey 访问令牌
     * @return true | false
     * @author Shawn Deng
     * @date 2020/6/12 12:03
     */
    boolean validateApiKey(String apiKey);

    /**
     * 创建开发者访问令牌
     *
     * @param userId 用户ID
     * @return API KEY
     * @author Shawn Deng
     * @date 2020/5/27 15:34
     */
    String createApiKey(Long userId);

    /**
     * 刷新开发者访问令牌
     *
     * @param userId 用户ID
     * @return 新的api key
     * @author Shawn Deng
     * @date 2020/5/27 17:59
     */
    String refreshApiKey(Long userId);
}
