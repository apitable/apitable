package com.vikadata.api.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 
* <p> 
* 高德地图 配置信息
* </p> 
* @author zoe zheng 
* @date 2022/6/15 16:53
*/
@ConfigurationProperties(prefix = "vikadata.lbs.amap")
public class AMapProperties {

    /**
     * 应用key
     */
    private String key;
    /**
     * jscode安全密钥
     */
    private String jscode;

    /**
     * 自定义地图反向代理
     */
    private Proxy styles;

    /**
     * 海外地图反向代理路径
     */
    private Proxy vectormap;

    /**
     * web服务api代理路径
     */
    private Proxy restapi;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getJscode() {
        return jscode;
    }

    public void setJscode(String jscode) {
        this.jscode = jscode;
    }

    public Proxy getStyles() {
        return styles;
    }

    public void setStyles(Proxy styles) {
        this.styles = styles;
    }

    public Proxy getVectormap() {
        return vectormap;
    }

    public void setVectormap(Proxy vectormap) {
        this.vectormap = vectormap;
    }

    public Proxy getRestapi() {
        return restapi;
    }

    public void setRestapi(Proxy restapi) {
        this.restapi = restapi;
    }

    public static class Proxy {
        /**
         * 反向代理路径
         */
        private String proxyPass;

        public String getProxyPass() {
            return proxyPass;
        }

        public void setProxyPass(String proxyPass) {
            this.proxyPass = proxyPass;
        }
    }
}
