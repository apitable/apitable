package com.vikadata.api.modular.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialFeishuEventLogEntity;

/**
 * 飞书事件日志 Mapper
 *
 * @author Shawn Deng
 * @date 2020-12-14 19:48:17
 */
public interface SocialFeishuEventLogMapper extends BaseMapper<SocialFeishuEventLogEntity> {

    /**
     * 查询UUID的总数
     *
     * @param uuid 事件唯一标识
     * @return 总数
     * @author Shawn Deng
     * @date 2020/12/16 14:21
     */
    Integer selectCountByUuid(@Param("uuid") String uuid);

    /**
     * 根据UUID查询
     *
     * @param uuid 事件唯一标识
     * @return SocialFeishuEventLogEntity
     * @author Shawn Deng
     * @date 2020/12/16 14:21
     */
    SocialFeishuEventLogEntity selectByUuid(@Param("uuid") String uuid);

    /**
     * 更新事件处理状态
     *
     * @param uuid 事件唯一标识
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2020/12/16 14:44
     */
    int updateStatusTrueByUuid(@Param("uuid") String uuid);

    /**
     * 查询租户最新的事件类型
     * @param tenantKey 企业标识
     * @param type 事件类型
     * @return SocialFeishuEventLogEntity
     * @author Shawn Deng 
     * @date 2021/7/30 19:16
     */
    String selectLatestByTenantKeyAndType(@Param("tenantKey") String tenantKey, @Param("type") String type);
}
