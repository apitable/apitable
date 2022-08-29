package com.vikadata.api.modular.client.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.ro.client.ClientBuildRo;
import com.vikadata.api.util.VikaVersion.Env;
import com.vikadata.entity.ClientReleaseVersionEntity;

/**
 * <p>
 * 版本发布表 服务类
 * </p>
 *
 * @author Zoe Zheng
 * @since 2020-04-07
 */
public interface IClientReleaseVersionService extends IService<ClientReleaseVersionEntity> {

    /**
     * 适配获取客户端版本号
     * @param env 客户端环境
     * @param pipelineId 客户端流水线标识
     * @return String
     */
    String getVersionOrDefault(Env env, String pipelineId);

    /**
     * 创建客户端版本
     *
     * @param clientBuildRo 请求参数
     * @author zoe zheng
     * @date 2020/4/9 10:34 上午
     */
    void createClientVersion(ClientBuildRo clientBuildRo);

    /**
     * 获取指定版本的HTML内容
     * @param version
     * @return
     */
    String getHtmlContentByVersion(String version);

    /**
     * 缓存刷新指定版本的html内容
     * @param version
     * @return
     */
    String refreshHtmlContent(String version);

    /**
     * 根据version获取htmlContent
     *
     * @param version 版本号
     * @return String
     * @author zoe zheng
     * @date 2020/4/9 10:36 上午
     */
    String getHtmlContentCacheIfAbsent(String version);

    /**
     * 发送发版邮件提醒
     *
     * @param version 发布版本
     * @author zoe zheng
     * @date 2020/4/10 4:21 下午
     */
    void sendNotifyEmail(String version);

    /**
     * 获取meta具体信息
     *
     * @param uri nginx $request_uri
     * @return meta
     * @author zoe zheng
     * @date 2020/5/19 12:34 下午
     */
    String getMetaContent(String uri);

    /**
     * 根据uri获取节点ID
     *
     * @param uri 请求路径
     * @return 节点ID
     * @author zoe zheng
     * @date 2020/7/7 3:15 下午
     */
    String getNodeIdFromUri(String uri);

    /**
     * 根据uri获取SpaceId
     *
     * @param uri 请求路径
     * @return SpaceId
     * @author Pengap
     * @date 2022/5/30 21:32:34
     */
    String getSpaceIdFromUri(String uri);

    /**
     * 查询版本号是否比datasheet当前版本高
     *
     * @param version 客户端版本
     * @return 返回差的版本正负
     * @author zoe zheng
     * @date 2021/3/1 11:18 上午
     */
    boolean isMoreThanClientVersion(String version);

    /**
     * 获取最新的正式版本号
     *
     * @return version
     * @author zoe zheng
     * @date 2021/3/23 7:58 下午
     */
    String getLatestVersion();
}
