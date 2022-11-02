package com.vikadata.api.modular.workspace.service;

import org.springframework.web.multipart.MultipartFile;

public interface VikaBundleService {

    /**
     * @param nodeId node id
     * @param saveData whether to save data
     * @param password file parsing password
     */
    void generate(String nodeId, boolean saveData, String password);

    /**
     * @param file      file
     * @param password  password
     * @param parentId  parentId
     * @param preNodeId preNodeId
     * @param userId user id
     */
    void analyze(MultipartFile file, String password, String parentId, String preNodeId, Long userId);
}
