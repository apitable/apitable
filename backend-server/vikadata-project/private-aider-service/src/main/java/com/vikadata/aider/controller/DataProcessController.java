package com.vikadata.aider.controller;


import javax.annotation.Resource;

import com.vikadata.aider.service.IDataProcessService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  Data Processor Controller
 * </p>
 */
@RestController
@RequestMapping(value = "/data")
public class DataProcessController {

    @Resource
    private IDataProcessService iDataProcessService;

    @RequestMapping(value = "/controlProcess")
    public ResponseData<Void> controlProcess()  {
        iDataProcessService.controlProcess();
        return ResponseData.success();
    }

    @RequestMapping(value = "/nodeCreated")
    public ResponseData<Void> nodeCreated()  {
        iDataProcessService.nodeCreated();
        return ResponseData.success();
    }

    @RequestMapping(value = "/mirrorWidget")
    public ResponseData<Void> mirrorWidget()  {
        iDataProcessService.mirrorWidget();
        return ResponseData.success();
    }
}
