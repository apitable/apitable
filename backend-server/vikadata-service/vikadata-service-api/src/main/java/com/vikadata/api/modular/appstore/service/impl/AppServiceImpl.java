package com.vikadata.api.modular.appstore.service.impl;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.appstore.service.IAppService;

import org.springframework.stereotype.Service;

/**
 *
 * @author Shawn Deng
 * @date 2022-01-17 15:27:54
 */
@Service
@Slf4j
public class AppServiceImpl implements IAppService {

    @Resource
    private IAppInstanceService iAppInstanceService;


}
