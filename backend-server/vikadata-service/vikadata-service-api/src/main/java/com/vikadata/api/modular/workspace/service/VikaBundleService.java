package com.vikadata.api.modular.workspace.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * Vika Bundle 服务
 * </p>
 *
 * @author Chambers
 * @date 2020/4/15
 */
public interface VikaBundleService {

    /**
     * 生成vika文件
     *
     * @param nodeId   节点ID
     * @param saveData 是否保存数据
     * @param password 文件解析密码
     * @author Chambers
     * @date 2020/4/15
     */
    void generate(String nodeId, boolean saveData, String password);

    /**
     * 解析vika文件
     *
     * @param file      文件
     * @param password  密码
     * @param parentId  父节点ID
     * @param preNodeId 前置节点ID
     * @param userId    用户ID
     * @author Chambers
     * @date 2020/4/15
     */
    void analyze(MultipartFile file, String password, String parentId, String preNodeId, Long userId);
}
