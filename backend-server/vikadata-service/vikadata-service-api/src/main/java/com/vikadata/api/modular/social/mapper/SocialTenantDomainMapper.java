package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.social.model.SpaceBindDomainDTO;
import com.vikadata.entity.SocialTenantDomainEntity;

/**
 * <p>
 * Third party platform integration - enterprise tenant exclusive domain name Mapper
 * </p>
 */
public interface SocialTenantDomainMapper extends BaseMapper<SocialTenantDomainEntity> {

    /**
     * Query domain name information according to the space
     *
     * @param spaceId   Space Id
     * @return Domain name information
     */
    SocialTenantDomainEntity selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Batch query of space domain name information
     *
     * @param spaceIds Space ID Collection
     * @return Domain name information
     */
    List<SocialTenantDomainEntity> selectBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * Count the number of duplicate prefixes of enterprise WeChat exclusive domain names
     *
     * @param domainPrefix Prefix domain name (all lowercase space Id)
     * @return int Number of domain names
     */
    int countTenantDomainName(String domainPrefix);

    /**
     * Query space ID
     *
     * @param domainName Enterprise domain name
     * @return Space Id
     */
    String selectSpaceIdByDomainName(@Param("domainName") String domainName);

    /**
     * Query the domain name of the space station
     *
     * @param spaceIds Space Ids
     * @return Domain Name Collection
     */
    List<SpaceBindDomainDTO> selectSpaceDomainBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * Modify domain name status
     *
     * @param spaceId Space Id
     * @param domainStatus State
     * @return int
     */
    int updateStatusBySpaceId(@Param("spaceId") String spaceId, @Param("domainStatus") int domainStatus);

    /**
     * Get the domain name binding space status
     *
     * @param domainName Domain name
     * @return Domain name binding information
     */
    SpaceBindDomainDTO selectSpaceDomainByDomainName(@Param("domainName") String domainName);

    /**
     * Delete the space domain name according to the space station ID
     *
     * @param spaceIds Space ID Collection
     * @return int  Number of rows affected
     */
    int deleteSpaceDomainBySpaceIds(@Param("spaceIds") List<String> spaceIds);

}
