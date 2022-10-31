package com.vikadata.integration.idaas.support;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * Account information ServiceAccount
 * </p>
 *
 */
public class ServiceAccount {

    private String clientId;

    private PrivateKey privateKey;

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(PrivateKey privateKey) {
        this.privateKey = privateKey;
    }

    public static class PrivateKey {

        private String p;

        private String kty;

        private String q;

        private String d;

        private String e;

        private String use;

        private String kid;

        private String qi;

        private String dp;

        private String dq;

        private String n;

        public String getP() {
            return p;
        }

        public void setP(String p) {
            this.p = p;
        }

        public String getKty() {
            return kty;
        }

        public void setKty(String kty) {
            this.kty = kty;
        }

        public String getQ() {
            return q;
        }

        public void setQ(String q) {
            this.q = q;
        }

        public String getD() {
            return d;
        }

        public void setD(String d) {
            this.d = d;
        }

        public String getE() {
            return e;
        }

        public void setE(String e) {
            this.e = e;
        }

        public String getUse() {
            return use;
        }

        public void setUse(String use) {
            this.use = use;
        }

        public String getKid() {
            return kid;
        }

        public void setKid(String kid) {
            this.kid = kid;
        }

        public String getQi() {
            return qi;
        }

        public void setQi(String qi) {
            this.qi = qi;
        }

        public String getDp() {
            return dp;
        }

        public void setDp(String dp) {
            this.dp = dp;
        }

        public String getDq() {
            return dq;
        }

        public void setDq(String dq) {
            this.dq = dq;
        }

        public String getN() {
            return n;
        }

        public void setN(String n) {
            this.n = n;
        }

        public Map<String, Object> toMap() {
            Map<String, Object> map = new HashMap<>(12);
            map.put("p", p);
            map.put("kty", kty);
            map.put("q", q);
            map.put("d", d);
            map.put("e", e);
            map.put("use", use);
            map.put("kid", kid);
            map.put("qi", qi);
            map.put("dp", dp);
            map.put("dq", dq);
            map.put("n", n);

            return map;
        }

    }

}
