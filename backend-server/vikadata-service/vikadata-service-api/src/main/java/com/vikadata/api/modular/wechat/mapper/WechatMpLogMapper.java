package com.vikadata.api.modular.wechat.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.vo.wechat.QrCodeStatisticsVo;
import com.vikadata.entity.WechatMpLogEntity;

/**
 * <p>
 * WeChat Mp Log Mapper
 * </p>
 */
public interface WechatMpLogMapper extends BaseMapper<WechatMpLogEntity> {

    /**
     * Get QR code statistics
     */
    QrCodeStatisticsVo getStatisticsData(@Param("appId") String appId, @Param("scene") String scene);
}
