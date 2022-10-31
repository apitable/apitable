package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.social.model.SpaceBindDomainDTO;
import com.vikadata.entity.SocialTenantDomainEntity;

/**
 * <p>
 * Third party platform integration - enterprise tenant exclusive domain name service interface
 * </p>
 */
public interface ISocialTenantDomainService extends IService<SocialTenantDomainEntity> {

    /**
     * Create domain name (status: binding)
     *
     * @param spaceId       Space ID
     * @param domainPrefix  Domain name prefix
     * @param domainName    DOMAIN NAME
     */
    SocialTenantDomainEntity createDomain(String spaceId, String domainPrefix, String domainName);

    /**
     * Enable domain name
     *
     * @param spaceId   Space ID
     */
    void enabledDomain(String spaceId);

    /**
     * Delete the domain name and delete the domain name DDNS resolution record
     *
     * @param spaceIds Space ID
     */
    void removeDomain(List<String> spaceIds);

    /**
     * Get the space station domain name
     *
     * @param spaceId           Space ID
     * @param apendHttpsPrefix  Whether to add https prefix automatically. If false, the domain name without protocol will be returned
     * @return Domain name (return to the public domain name if it is not available)
     */
    String getDomainNameBySpaceId(String spaceId, boolean apendHttpsPrefix);

    /**
     * Obtain the domain name of the space station (domain name without http protocol header)
     *
     * @param spaceId           Space ID
     * @return Domain name (return to the public domain name if it is not available)
     */
    default String getDomainNameBySpaceId(String spaceId) {
        return getDomainNameBySpaceId(spaceId, false);
    }

    /**
     * Get the default domain name of the space from the configuration file
     *
     * @return Public domain name
     */
    String getSpaceDefaultDomainName();

    /**
     * Get Space ID
     *
     * @param domainName    Enterprise domain name
     * @return spaceId
     */
    String getSpaceIdByDomainName(String domainName);

    /**
     * Batch acquisition of space station domain names
     *
     * @param spaceIds Space Ids
     * @return Domain name corresponding to the space station (unfiltered)
     */
    List<SpaceBindDomainDTO> getSpaceDomainBySpaceIds(List<String> spaceIds);

    /**
     * Batch acquisition of space station domain names
     *
     * @param spaceIds   Space Ids
     * @return key:Space ID，value:Space station binding domain name
     */
    Map<String, String> getSpaceDomainBySpaceIdsToMap(List<String> spaceIds);

    /**
     * Get the domain name binding space status
     *
     * @param domainName Domain name
     * @return Domain name binding information
     */
    SpaceBindDomainDTO getSpaceDomainByDomainName(String domainName);

}
