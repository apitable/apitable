package com.vikadata.aider.service;

import javax.annotation.Resource;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.aider.AiderApplication;

import org.springframework.boot.test.context.SpringBootTest;


@Disabled("no assertion")
@SpringBootTest(classes = AiderApplication.class)
public class IDataProcessServiceTest {

    @Resource
    private IDataProcessService iDataProcessService;

    @Test
    public void controlProcess() {
        iDataProcessService.controlProcess();
    }

    @Test
    public void nodeCreated() {
        iDataProcessService.nodeCreated();
    }

    @Test
    public void mirrorWidget() {
        iDataProcessService.mirrorWidget();
    }
}
