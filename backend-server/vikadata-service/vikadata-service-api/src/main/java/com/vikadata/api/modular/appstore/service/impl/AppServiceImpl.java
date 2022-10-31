package com.vikadata.api.modular.appstore.service.impl;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.appstore.service.IAppService;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AppServiceImpl implements IAppService {

    @Resource
    private IAppInstanceService iAppInstanceService;


}
