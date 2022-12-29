package com.vikadata.api.space.service;

import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.dto.SpaceAuditPageParamDTO;
import com.vikadata.api.space.vo.SpaceAuditPageVO;

public interface ISpaceAuditService {

    /**
     * get spatial audit paging information
     *
     * @param spaceId space id
     * @param param     param
     * @return SpaceAuditPageVO
     */
    PageInfo<SpaceAuditPageVO> getSpaceAuditPageVO(String spaceId, SpaceAuditPageParamDTO param);
}
