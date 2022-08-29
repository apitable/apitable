package com.vikadata.api.modular.wechat.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.model.vo.wechat.QrCodeStatisticsVo;
import com.vikadata.entity.WechatMpLogEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 微信公众号日志表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/18
 */
public interface WechatMpLogMapper extends BaseMapper<WechatMpLogEntity> {

    /**
     * 获取二维码的统计数据
     *
     * @param appId appId
     * @param scene 场景值
     * @return statistics
     * @author Chambers
     * @date 2020/8/24
     */
    QrCodeStatisticsVo getStatisticsData(@Param("appId") String appId, @Param("scene") String scene);
}
