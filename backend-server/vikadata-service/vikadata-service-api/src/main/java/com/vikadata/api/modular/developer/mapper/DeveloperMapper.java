package com.vikadata.api.modular.developer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.DeveloperEntity;

/**
 * <p>
 * 开发者表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 15:16
 */
public interface DeveloperMapper extends BaseMapper<DeveloperEntity> {

    /**
     * 根据用户ID查询
     *
     * @param userId 用户ID
     * @return DeveloperEntity
     * @author Shawn Deng
     * @date 2020/5/27 17:51
     */
    DeveloperEntity selectByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID修改API KEY
     *
     * @param userId 用户ID
     * @param apiKey 访问令牌
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/5/27 17:56
     */
    int updateApiKeyByUserId(@Param("userId") Long userId, @Param("apiKey") String apiKey);

    /**
     * 根据访问令牌查询用户ID
     *
     * @param apiKey 访问令牌
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/6/12 11:16
     */
    Long selectUserIdByApiKey(@Param("apiKey") String apiKey);
}
