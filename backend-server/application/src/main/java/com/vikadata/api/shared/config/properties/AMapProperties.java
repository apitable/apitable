package com.vikadata.api.shared.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 
* <p> 
* amap properties
* </p> 
* @author zoe zheng 
*/
@ConfigurationProperties(prefix = "vikadata.lbs.amap")
public class AMapProperties {

    private String key;

    private String jscode;

    private Proxy styles;

    private Proxy vectormap;

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

        private String proxyPass;

        public String getProxyPass() {
            return proxyPass;
        }

        public void setProxyPass(String proxyPass) {
            this.proxyPass = proxyPass;
        }
    }
}
