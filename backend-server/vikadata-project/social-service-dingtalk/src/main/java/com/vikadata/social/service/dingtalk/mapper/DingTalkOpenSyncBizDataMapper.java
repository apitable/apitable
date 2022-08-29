package com.vikadata.social.service.dingtalk.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataEntity;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantBizDataDto;

/**
 * <p> 
 * 第三方平台集成-高优先级推送数据 Mapper 接口
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 15:27
 */
public interface DingTalkOpenSyncBizDataMapper extends BaseMapper<DingTalkOpenSyncBizDataEntity> {

    /**
     * 获取事件数据
     * @param subscribeId 订阅ID
     * @param bizTypes 类目类型
     * @param corpId 租户ID
     * @return List<SocialTenantBizDataDto>
     * @author zoe zheng
     * @date 2022/6/1 11:30
     */
    List<SocialTenantBizDataDto> selectBySubscribeIdAndCorpIdAndBizTypes(@Param("subscribeId") String subscribeId,
            @Param("corpId") String corpId, @Param("bizTypes") List<Integer> bizTypes);
}
