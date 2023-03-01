package com.apitable.starter.oss.test;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.apitable.Application;

@SpringBootTest(Application.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("HuaweiCloudOBS")
public class HuaweiCloudOssClientTest{
  
}