package com.vikadata.api.modular.finance.service;


import java.util.List;
import java.util.Map;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.modular.internal.model.InternalSpaceSubscriptionVo;
import com.vikadata.api.modular.space.model.SpaceSubscriptionDto;
import com.vikadata.api.modular.space.model.vo.SpaceCapacityPageVO;
import com.vikadata.api.modular.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.util.billing.model.BillingPlanFeature;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;

/**
 * <p>
 * 空间站订阅 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/8/24 17:52
 */
public interface ISpaceSubscriptionService {

    /**
     * 批量获取空间站订阅方案的规格
     * @param spaceIds 空间ID列表
     * @return spaceId -> BillingPlanFeature
     */
    Map<String, BillingPlanFeature> getSubscriptionFeatureBySpaceIds(List<String> spaceIds);

    /**
     * 获取指定空间站的订阅方案
     *
     * @param spaceId 空间ID
     * @return 订阅方案内容
     * @author Shawn Deng
     * @date 2020/9/12 14:54
     */
    SubscribePlanInfo getPlanInfoBySpaceId(String spaceId);

    /**
     * 获取空间站的订阅信息
     *
     * @param spaceId 空间ID
     * @return 空间站的订阅信息
     * @author Shawn Deng
     * @date 2020/8/31 13:16
     */
    SpaceSubscribeVo getSpaceSubscription(String spaceId);

    /**
     * 获取空间订阅计划的对应容量
     *
     * @param spaceId 空间ID
     * @return 容量值
     * @author Shawn Deng
     * @date 2020/9/17 13:18
     */
    long getPlanMaxCapacity(String spaceId);

    /**
     * 检查空间附件容量
     *
     * @param spaceId  空间ID
     * @param fileSize 文件大小
     * @param checksum MD5摘要
     * @author Chambers
     * @date 2020/6/16
     */
    void checkCapacity(String spaceId, long fileSize, String checksum);

    /**
     * 获取空间订阅计划的对应最大表格数
     *
     * @param spaceId 空间ID
     * @return 数值
     * @author Shawn Deng
     * @date 2020/9/17 13:18
     */
    long getPlanMaxSheetNums(String spaceId);

    /**
     * 检查数表最大数量限制
     *
     * @param spaceId   空间ID
     * @param createSum 创建数量
     * @author Shawn Deng
     * @date 2020/9/18 20:45
     */
    void checkSheetNums(String spaceId, int createSum);

    /**
     * 获取空间订阅计划的对应最大座席数
     *
     * @param spaceId 空间ID
     * @return 数值
     * @author Shawn Deng
     * @date 2020/9/17 13:18
     */
    long getPlanSeats(String spaceId);

    /**
     * 检查成员数量上限
     *
     * @param spaceId 空间ID
     * @author Chambers
     * @date 2020/6/16
     */
    void checkSeat(String spaceId);

    /**
     * 获取空间订阅计划的对应最大子管理员数
     *
     * @param spaceId 空间ID
     * @return 数值
     * @author Shawn Deng
     * @date 2020/9/17 13:18
     */
    long getPlanMaxSubAdmins(String spaceId);

    /**
     * 检查管理员数量上限
     *
     * @param spaceId 空间ID
     * @author Chambers
     * @date 2020/6/16
     */
    void checkSubAdmins(String spaceId);

    /**
     * 获取空间订阅计划的对应最大行数
     *
     * @param spaceId 空间ID
     * @return 数值
     * @author Shawn Deng
     * @date 2020/9/17 13:18
     */
    long getPlanMaxRows(String spaceId);

    /**
     * 获取空间订阅计划的审计可查询天数
     *
     * @param spaceId 空间ID
     * @return 数值
     * @author Chambers
     * @date 2022/6/8
     */
    long getPlanAuditQueryDays(String spaceId);

    /**
     * 获取空间订阅计划的对应回收站最大保存天数
     *
     * @param spaceId 空间ID
     * @return 数值
     * @author Shawn Deng
     * @date 2020/9/17 13:18
     */
    long getPlanTrashRemainDays(String spaceId);

    /**
     * 获取空间的订阅信息
     * 内部接口
     *
     * @param spaceId 空间ID
     * @return InternalSpaceSubscriptionVo
     * @author Chambers
     * @date 2020/9/12
     */
    InternalSpaceSubscriptionVo getSpaceSubscriptionVo(String spaceId);

    /**
     * 处理过期的订阅
     *
     * @param spaceId 空间ID
     * @author zoe zheng
     * @date 2022/5/26 11:30
     */
    void handleExpiredSubscription(String spaceId);

    /**
     * 获取空间赠送的未过期附件容量
     * 赠送的附件容量是附件订阅计划
     *
     * @author liuzijing
     * @date 2022/8/15
     */
    Long getSpaceUnExpireGiftCapacity(String spaceId);

    /**
     * 获取空间附件容量明细
     *
     * @param spaceId  空间ID
     * @param isExpire 附件容量是否失效
     * @param page     分页请求参数
     * @return SpaceCapacityPageVO
     * @author liuzijing
     * @date 2022/8/12
     */
    IPage<SpaceCapacityPageVO> getSpaceCapacityDetail(String spaceId, Boolean isExpire, Page page);

    /**
     * 处理附件容量订单信息
     *
     * @param spaceSubscriptionDtoIPage 附加订阅计划订单分页信息
     * @param page                      分页请求参数
     * @return SpaceCapacityPageVO
     * @author liuzijing
     * @date 2022/8/17
     */
    IPage<SpaceCapacityPageVO> handleCapacitySubscription(IPage<SpaceSubscriptionDto> spaceSubscriptionDtoIPage, Page page);

    /**
     * 检验空间站是否认证获得官方附件容量奖励
     *
     * @paarm spaceId   空间ID
     * @return 附件容量明细记录
     * @author liuzijing
     * @date 2022/8/24
     */
    SpaceCapacityPageVO checkOfficialGiftCapacity(String spaceId);
}
