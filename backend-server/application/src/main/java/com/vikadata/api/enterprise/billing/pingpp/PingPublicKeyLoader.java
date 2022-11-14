package com.vikadata.api.enterprise.billing.pingpp;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;

import cn.hutool.core.io.IoUtil;
import org.apache.commons.codec.binary.Base64;

import org.springframework.core.io.ClassPathResource;

/**
 * ping++ public key file loader
 * @author Shawn Deng
 */
public class PingPublicKeyLoader {

    public static String getInstance() {
        return Singleton.INSTANCE.getSingleton();
    }

    public static PublicKey getPublicKey() throws NoSuchAlgorithmException, InvalidKeySpecException {
        String pubKeyString = getInstance();
        pubKeyString = pubKeyString.replaceAll("(-+BEGIN PUBLIC KEY-+\\r?\\n|-+END PUBLIC KEY-+\\r?\\n?)", "");
        byte[] keyBytes = Base64.decodeBase64(pubKeyString.getBytes(StandardCharsets.UTF_8));
        // generate public key
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(spec);
    }

    private enum Singleton {
        INSTANCE;

        private final String singleton;

        Singleton() {
            try {
                InputStream resourceAsStream = ClassPathResource.class.getClassLoader().getResourceAsStream("cert/pingpp_public_key.pem");
                if (resourceAsStream == null) {
                    throw new IOException("Unable to get public key file");
                }
                singleton = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
            }
            catch (IOException e) {
                throw new RuntimeException("Failed to load public key file");
            }
        }

        public String getSingleton() {
            return singleton;
        }
    }
}
