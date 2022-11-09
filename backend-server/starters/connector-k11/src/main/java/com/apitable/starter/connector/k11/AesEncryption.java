package com.apitable.starter.connector.k11;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.Mac;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * <p>
 * Aes Encryption
 * </p>
 */
public class AesEncryption {
    private final HashMap<String, String> modes = new HashMap<String, String>() {
        { put("CBC", "AES/CBC/PKCS5Padding"); };
        { put("CFB", "AES/CFB8/NoPadding"); }
    };

    private final int saltLen = 16;
    private final int ivLen = 16;
    private final int macLen = 32;

    private final String mode;
    private final int keyLen;
    private byte[] masterKey;

    public int keyIterations = 20000;
    public Boolean base64 = true;

    public AesEncryption(String mode, int... size) throws IllegalArgumentException {
        int keySize = (size.length > 0) ? size[0] : 128;
        this.mode = mode.toUpperCase();
        this.keyLen = keySize / 8;

        if (this.modes.get(this.mode) == null) {
            throw new IllegalArgumentException("Encryption mode not supported!");
        }
        List<Integer> sizes = Arrays.asList(128, 192, 256);
        if (!sizes.contains(keySize)) {
            throw new IllegalArgumentException("Invalid key size!");
        }
        if (keySize > maxKeyLen()) {
            throw new IllegalArgumentException("Key size not supported!");
        }
    }

    public AesEncryption() throws IllegalArgumentException {
        this("CBC", 128);
    }

    public byte[] encrypt(byte[] data, String... password) {
        byte[] iv = randomBytes(ivLen);
        byte[] salt = randomBytes(saltLen);
        try {
            SecretKeySpec[] keys = this.keys(salt, password);
            SecretKeySpec aesKey = keys[0], macKey = keys[1];

            Cipher cipher = this.cipher(Cipher.ENCRYPT_MODE, aesKey, iv);
            byte[] ciphertext = cipher.doFinal(data);
            byte[] encrypted = new byte[saltLen + ivLen + ciphertext.length + macLen];

            System.arraycopy(salt, 0, encrypted, 0, saltLen);
            System.arraycopy(iv, 0, encrypted, saltLen, ivLen);
            System.arraycopy(ciphertext, 0, encrypted, saltLen + ivLen, ciphertext.length);

            byte[] iv_ct = Arrays.copyOfRange(encrypted, saltLen, encrypted.length - macLen);
            byte[] mac = sign(iv_ct, macKey);
            System.arraycopy(mac, 0, encrypted, encrypted.length - macLen, mac.length);

            if (this.base64) {
                return Base64.getEncoder().encode(encrypted);
            }
            return encrypted;
        } catch (IllegalArgumentException e) {
            this.errorHandler(e);
        } catch (IllegalBlockSizeException | BadPaddingException e) {
            throw new AssertionError(e);
        }
        return null;
    }

    public byte[] encrypt(String data, String... password) {
        return encrypt(data.getBytes(), password);
    }

    public byte[] decrypt(byte[] data, String... password) {
        try {
            if (base64) {
                data = Base64.getDecoder().decode(data);
            }
            byte[] salt = Arrays.copyOfRange(data, 0, saltLen);
            byte[] iv = Arrays.copyOfRange(data, saltLen, saltLen + ivLen);
            byte[] ciphertext = Arrays.copyOfRange(data, saltLen + ivLen, data.length - macLen);
            byte[] mac = Arrays.copyOfRange(data, data.length - macLen, data.length);

            SecretKeySpec[] keys = this.keys(salt, password);
            SecretKeySpec aesKey = keys[0], macKey = keys[1];

            byte[] iv_ct = Arrays.copyOfRange(data, saltLen, data.length - macLen);
            this.verify(iv_ct, mac, macKey);

            Cipher cipher = this.cipher(Cipher.DECRYPT_MODE, aesKey, iv);
            return cipher.doFinal(ciphertext);
        } catch (IllegalArgumentException | ArrayIndexOutOfBoundsException | IllegalBlockSizeException | BadPaddingException e) {
            this.errorHandler(e);
        }
        return null;
    }

    public byte[] decrypt(String data, String... password) {
        return decrypt(data.getBytes(), password);
    }

    public void setMasterKey(byte[] key, boolean... raw) {
        boolean _raw = raw.length > 0 && raw[0];
        try {
            masterKey = (_raw) ? key : Base64.getDecoder().decode(key);
        } catch (IllegalArgumentException e) {
            this.errorHandler(e);
        }
    }

    public void setMasterKey(String key) {
        this.setMasterKey(key.getBytes(), false);
    }

    public byte[] getMasterKey(boolean... raw) {
        boolean _raw = raw != null && raw.length > 0 && raw[0];
        if (this.masterKey == null) {
            this.errorHandler(new Exception("Key not set!"));
        } else if (!_raw) {
            return Base64.getEncoder().encode(this.masterKey);
        }
        return this.masterKey;
    }

    public byte[] randomKeyGen(int keyLen, boolean... raw) {
        boolean _raw = raw.length > 0 && raw[0];
        masterKey = this.randomBytes(keyLen);
        return (_raw) ? masterKey : Base64.getEncoder().encode(masterKey);
    }

    public byte[] randomKeyGen(boolean... raw) {
        return this.randomKeyGen(32, raw);
    }

    protected void errorHandler(Exception exception) {
        System.out.println(exception.getMessage());
    }

    private SecretKeySpec[] keys(byte[] salt, String... password) throws IllegalArgumentException {
        byte[] dkey;
        int macKeyLen = 32;
        if (password != null && password.length > 0) {
            dkey = this.pbkdf2Sha512(password[0], salt, keyLen + macKeyLen);
        } else if (this.masterKey != null) {
            dkey = this.hkdfSha256(this.masterKey, salt, keyLen + macKeyLen);
        } else {
            throw new IllegalArgumentException("Key not define!");
        }
        return new SecretKeySpec[] {
                new SecretKeySpec(dkey, 0, keyLen, "AES"),
                new SecretKeySpec(dkey, keyLen, macKeyLen, "HmacSHA256")
        };
    }

    private byte[] randomBytes(int size) {
        byte[] rb = new byte[size];
        try {
            SecureRandom srng = SecureRandom.getInstance("SHA1PRNG");
            srng.nextBytes(rb);
            return rb;
        } catch (NoSuchAlgorithmException e) {
            throw new AssertionError(e);
        }
    }

    private Cipher cipher(int cipherMode, SecretKey key, byte[] iv) {
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        try {
            Cipher cipher = Cipher.getInstance(modes.get(mode));
            cipher.init(cipherMode, key, ivSpec);
            return cipher;
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | InvalidAlgorithmParameterException e) {
            throw new AssertionError(e);
        }
    }

    private byte[] sign(byte[] data, SecretKeySpec key) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(key);
            return  hmac.doFinal(data);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new AssertionError(e);
        }
    }

    private void verify(byte[] data, byte[] mac, SecretKeySpec key) throws IllegalArgumentException {
        byte[] dataMac = sign(data, key);
        if (!MessageDigest.isEqual(dataMac, mac)) {
            throw new IllegalArgumentException("MAC check failed!");
        }
    }

    private byte[] pbkdf2Sha512(String password, byte[] salt, int dkeyLen) {
        try {
            PBEKeySpec kspec = new PBEKeySpec(
                    password.toCharArray(), salt, keyIterations, dkeyLen * 8
            );
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512");
            byte[] dkey = skf.generateSecret(kspec).getEncoded();
            kspec.clearPassword();
            return dkey;
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new AssertionError(e);
        }
    }

    private byte[] hkdfSha256(byte[] key, byte[] salt, int dkeyLen) {
        byte[] dkey = new byte[dkeyLen];
        byte[] hkey = new byte[0];
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(salt, "HmacSHA256"));
            byte[] prk = hmac.doFinal(key);
            int hashLen = hmac.getMacLength();

            for (int i = 0; i < dkeyLen; i +=  hashLen) {
                hkey = Arrays.copyOf(hkey, hkey.length + 1);
                hkey[hkey.length - 1] = (byte)(i / hashLen + 1);
                hmac.init(new SecretKeySpec(prk, "HmacSHA256"));
                hkey = hmac.doFinal(hkey);

                if (i + hashLen > dkeyLen) {
                    hashLen = hashLen - (i + hashLen - dkeyLen);
                }
                System.arraycopy(hkey, 0, dkey, i, hashLen);
            }
            return dkey;
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new AssertionError(e);
        }
    }

    private int maxKeyLen() {
        try {
            return Cipher.getMaxAllowedKeyLength("AES");
        } catch (NoSuchAlgorithmException e) {
            throw new AssertionError(e);
        }
    }
}
