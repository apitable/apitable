package com.vikadata.api.modular.client.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.client.ClientEntryDetailDto;
import com.vikadata.entity.ClientReleaseVersionEntity;

/**
 * <p>
 * Version Publish Table Mapper Interface
 * </p>
 */
public interface ClientReleaseVersionMapper extends BaseMapper<ClientReleaseVersionEntity> {

    /**
     * Get details according to version
     *
     * @param version Version No
     * @return ClientHtmlContentDto
     */
    ClientEntryDetailDto selectClientEntryDetailByVersion(@Param("version") String version);

    /**
     * Get the latest version of the client according to the index
     *
     * @return Version Number Field Value
     */
    @InterceptorIgnore(illegalSql = "true")
    String selectClientLatestVersionByOffset(@Param("offset") long offset);

    /**
     * Get the latest version number
     *
     * @return Version Number Field Value
     */
    @InterceptorIgnore(illegalSql = "true")
    String selectClientLatestVersion();

    /**
     * Total Queries
     *
     * @return Total
     */
    @InterceptorIgnore(illegalSql = "true")
    Long selectTotalCount();
}
