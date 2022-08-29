package com.vikadata.api.modular.wechat.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.WechatKeywordReplyEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 微信-关键词回复规则 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-08-17
 */
public interface WechatKeywordReplyMapper extends BaseMapper<WechatKeywordReplyEntity> {

    /**
     * 清理所有公众号关键词回复
     *
     * @param appId 公众号APPID
     * @return 数量
     * @author BensonCheung
     * @date 2020/08/17
     */
    Integer deleteKeywordReplies(@Param("appId") String appId);


    /**
     * 更新公众号关键词回复，先清理后同步
     *
     * @param appId 公众号APPID
     * @param list 公众号关键词规则列表
     * @return 数量
     * @author BensonCheung
     * @date 2020/08/17
     */
    Integer insertBatchWechatKeywordReply(@Param("appId") String appId, @Param("list") List<WechatKeywordReplyEntity> list);

    /**
     * 更新公众号关键词回复，先清理后同步
     *
     * @param appId 公众号APPID
     * @param keyword 关键词
     * @return 回复内容列表
     * @author BensonCheung
     * @date 2020/08/17
     */
    List<WechatKeywordReplyEntity> findRepliesByKeyword(@Param("appId")String appId, @Param("keyword")String keyword);
}
