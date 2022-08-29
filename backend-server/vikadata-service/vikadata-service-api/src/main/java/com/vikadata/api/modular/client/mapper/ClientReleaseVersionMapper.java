package com.vikadata.api.modular.client.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.client.ClientEntryDetailDto;
import com.vikadata.entity.ClientReleaseVersionEntity;

/**
 * <p>
 * 版本发布表 Mapper 接口
 * </p>
 *
 * @author Zoe Zheng
 * @since 2020-04-07
 */
public interface ClientReleaseVersionMapper extends BaseMapper<ClientReleaseVersionEntity> {

    /**
     * 根据version获取详情
     *
     * @param version 版本号
     * @return ClientHtmlContentDto
     * @author zoe zheng
     * @date 2020/4/9 10:36 上午
     */
    ClientEntryDetailDto selectClientEntryDetailByVersion(@Param("version") String version);

    /**
     * 根据索引获取客户端最新的版本
     * @return 版本号字段值
     */
    @InterceptorIgnore(illegalSql = "true")
    String selectClientLatestVersionByOffset(@Param("offset") long offset);

    /**
     * 获取最新的版本号
     * @return 版本号字段值
     */
    @InterceptorIgnore(illegalSql = "true")
    String selectClientLatestVersion();

    /**
     * 查询总数
     * @return 总数
     */
    @InterceptorIgnore(illegalSql = "true")
    Long selectTotalCount();
}
