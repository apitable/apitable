package com.apitable.space.assembler;

import cn.hutool.core.util.ObjectUtil;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.space.dto.SpaceDTO;
import com.apitable.space.vo.SpaceSocialConfig;
import com.apitable.space.vo.SpaceVO;

public class SpaceAssembler {

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
