package com.vikadata.integration.yozo;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-22 10:49:28
 */
public class YozoPreviewResponse extends YozoBaseResponse {

    private Data data;

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {

        private String data;

        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }
    }
}
