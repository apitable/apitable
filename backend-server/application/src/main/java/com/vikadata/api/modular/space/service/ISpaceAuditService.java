package com.vikadata.api.modular.space.service;

import com.vikadata.api.util.page.PageInfo;
import com.vikadata.api.modular.space.model.SpaceAuditPageParam;
import com.vikadata.api.modular.space.model.vo.SpaceAuditPageVO;

public interface ISpaceAuditService {

    /**
     * get spatial audit paging information
     *
     * @param spaceId space id
     * @param param     param
     * @return SpaceAuditPageVO
     */
    PageInfo<SpaceAuditPageVO> getSpaceAuditPageVO(String spaceId, SpaceAuditPageParam param);
}
