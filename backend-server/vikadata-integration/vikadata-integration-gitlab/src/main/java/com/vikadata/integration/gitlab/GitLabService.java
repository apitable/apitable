package com.vikadata.integration.gitlab;

import org.gitlab4j.api.GitLabApi;


/**
 * GitLab API Service interface
 *
 */
public class GitLabService {

    private final GitLabApi gitLabApi;

    public GitLabService(GitLabConfig config) {
        this.gitLabApi = new GitLabApi(config.getApiVersion(), config.getUrl(), config.getPersonalAccessToken());
    }
}
