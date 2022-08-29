package com.vikadata.api.modular.social.service;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitDelayEntity;

/**
 * <p>
 * 企微服务商接口许可延时任务处理信息
 * </p>
 * @author 刘斌华
 * @date 2022-07-19 09:50:09
 */
public interface ISocialWecomPermitDelayService extends IService<SocialWecomPermitDelayEntity> {

    /**
     * 添加延时处理信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param firstAuthTime 首次安装授权的时间
     * @param delayType 延时处理类型
     * @param processStatus 处理状态
     * @return 新增的延时处理信息。为空则表示没有新增，交由已存在的任务处理
     * @author 刘斌华
     * @date 2022-07-19 11:01:32
     */
    SocialWecomPermitDelayEntity addAuthCorp(String suiteId, String authCorpId, LocalDateTime firstAuthTime,
            Integer delayType, Integer processStatus);

    /**
     * 获取企业的延时处理信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param delayType 延时处理类型
     * @param processStatuses 处理状态
     * @return 延时处理信息
     * @author 刘斌华
     * @date 2022-07-19 11:11:27
     */
    List<SocialWecomPermitDelayEntity> getByProcessStatuses(String suiteId, String authCorpId, Integer delayType, List<Integer> processStatuses);

    /**
     * 获取企业的延时处理信息
     *
     * @param suiteId 应用套件 ID
     * @param processStatus 处理状态
     * @param limit 数据偏移
     * @param skip 返回的数量
     * @return 延时处理信息
     * @author 刘斌华
     * @date 2022-07-19 11:11:27
     */
    List<SocialWecomPermitDelayEntity> getBySuiteIdAndProcessStatus(String suiteId, Integer processStatus, Integer skip, Integer limit);

    /**
     * 批量处理待处理数据
     *
     * @param suiteId 应用套件 ID
     * @author 刘斌华
     * @date 2022-08-12 14:30:43
     */
    void batchProcessPending(String suiteId);

}
