package com.vikadata.api.modular.space.service;

import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.modular.space.model.SpaceAuditPageParam;
import com.vikadata.api.modular.space.model.vo.SpaceAuditPageVO;

/**
 * <p>
 * 空间审计 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2022/6/7
 */
public interface ISpaceAuditService {

    /**
     * 获取空间审计分页信息
     *
     * @param spaceId   空间ID
     * @param param     查询参数
     * @return SpaceAuditPageVO
     * @author Chambers
     * @date 2022/6/7
     */
    PageInfo<SpaceAuditPageVO> getSpaceAuditPageVO(String spaceId, SpaceAuditPageParam param);
}
