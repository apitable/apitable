package com.apitable.space.assembler;

import cn.hutool.core.util.ObjectUtil;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.space.dto.SpaceDTO;
import com.apitable.space.vo.SpaceSocialConfig;
import com.apitable.space.vo.SpaceVO;

/**
 * space assembler.
 */
public class SpaceAssembler {

    /**
     * transform space dto to space vo.
     *
     * @param spaceDTO space dto
     * @return space vo
     */
    public static SpaceVO toVO(SpaceDTO spaceDTO) {
        SpaceVO spaceVO = new SpaceVO();
        spaceVO.setSpaceId(spaceDTO.getSpaceId());
        spaceVO.setName(spaceDTO.getName());
        spaceVO.setLogo(spaceDTO.getLogo());
        spaceVO.setPoint(spaceDTO.getPoint());
        spaceVO.setAdmin(spaceDTO.getAdmin());
        spaceVO.setPreDeleted(spaceDTO.getPreDeleted());
        return spaceVO;
    }

    /**
     * transform social connect info to social config.
     *
     * @param socialConnectInfo social connect info
     * @return social config
     */
    public static SpaceSocialConfig toSocialConfig(SocialConnectInfo socialConnectInfo) {
        SpaceSocialConfig socialConfig = new SpaceSocialConfig();
        if (ObjectUtil.isNotNull(socialConnectInfo)) {
            socialConfig.setEnabled(socialConnectInfo.isEnabled());
            socialConfig.setPlatform(socialConnectInfo.getPlatform());
            socialConfig.setAppType(socialConnectInfo.getAppType());
            socialConfig.setAuthMode(socialConnectInfo.getAuthMode());
            socialConfig.setContactSyncing(socialConnectInfo.contactSyncing());
        }
        return socialConfig;
    }
}
