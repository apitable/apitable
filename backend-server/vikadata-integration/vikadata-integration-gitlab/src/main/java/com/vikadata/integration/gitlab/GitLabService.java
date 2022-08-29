package com.vikadata.integration.gitlab;

import org.gitlab4j.api.GitLabApi;

/**
 * GitLab API 服务接口
 * @author Shawn Deng
 * @date 2021-01-13 14:19:10
 */
public class GitLabService {

    private final GitLabApi gitLabApi;

    public GitLabService(GitLabConfig config) {
        this.gitLabApi = new GitLabApi(config.getApiVersion(), config.getUrl(), config.getPersonalAccessToken());
    }
}
