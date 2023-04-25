package com.apitable.widget.util;

import com.apitable.shared.util.WidgetReleaseVersionUtils;
import com.apitable.widget.enums.InstallEnvType;
import com.apitable.widget.enums.RuntimeEnvType;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

/**
 * <p>
 *
 * </p>
 *
 * @author Pengap
 */
public class WidgetCliTest {

    @Test
    public void generateReleaseSha() {
        String packageId = "wpkY6DKgb3iVk", version = "1.0.0";
        System.out.println(WidgetReleaseVersionUtils.createVersionSHA(packageId, version));
    }

    @Test
    public void checkVserion() {
        String[] version = { "1x.1x.1x", "1x.1x.1", "1x.1.1", "1.1.1", "1.0.0",
                "1.1", "v0.0.1", "1.1.1.1", "1.1.1-RC.1", "1.1.1-RC" };
        for (String v : version) {
            System.out.println(v + " : " + WidgetReleaseVersionUtils.checkVersion(v));
        }
    }

    @Test
    public void installEnvToTypeTest() {
        String value = "panel";
        InstallEnvType installEnvType = InstallEnvType.toType(value);
        Assertions.assertEquals(InstallEnvType.PANEL, installEnvType);
    }

    @Test
    public void installEnvToValueListTest() {
        String codes = "01";
        List<String> list = InstallEnvType.toValueList(codes);
        Assertions.assertEquals("dashboard", list.get(0));
    }

    @Test
    public void installEnvToValueListWithTwoValuesTest() {
        String codes = "0102";
        List<String> list = InstallEnvType.toValueList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void installEnvToValueListWithRepeatValuesTest() {
        String codes = "01010202";
        List<String> list = InstallEnvType.toValueList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void installEnvToTypeListTest() {
        String codes = "01";
        List<InstallEnvType> list = InstallEnvType.toTypeList(codes);
        Assertions.assertEquals(InstallEnvType.DASHBOARD, list.get(0));
    }

    @Test
    public void installEnvToTypeListWithTwoValuesTest() {
        String codes = "0102";
        List<InstallEnvType> list = InstallEnvType.toTypeList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void installEnvToTypeListWithRepeatValuesTest() {
        String codes = "01010202";
        List<InstallEnvType> list = InstallEnvType.toTypeList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void installEnvGetInstallEnvCodeTest() {
        List<String> list = new ArrayList<>();
        list.add("panel");
        String code = InstallEnvType.getInstallEnvCode(list);
        Assertions.assertEquals("02", code);
    }

    @Test
    public void installEnvGetInstallEnvCodesTest() {
        List<String> list = new ArrayList<>();
        list.add("dashboard");
        list.add("panel");
        String codes = InstallEnvType.getInstallEnvCode(list);
        Assertions.assertEquals("0102", codes);
    }

    @Test
    public void runtimeEnvToTypeTest() {
        String value = "mobile";
        RuntimeEnvType runtimeEnvType = RuntimeEnvType.toType(value);
        Assertions.assertEquals(RuntimeEnvType.MOBILE, runtimeEnvType);
    }

    @Test
    public void runtimeEnvToValueListTest() {
        String codes = "01";
        List<String> list = RuntimeEnvType.toValueList(codes);
        Assertions.assertEquals("mobile", list.get(0));
    }

    @Test
    public void runtimeEnvToValueListWithTwoValuesTest() {
        String codes = "0102";
        List<String> list = RuntimeEnvType.toValueList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void runtimeEnvToValueListWithRepeatValuesTest() {
        String codes = "01010202";
        List<String> list = RuntimeEnvType.toValueList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void runtimeEnvToTypeListTest() {
        String codes = "01";
        List<RuntimeEnvType> list = RuntimeEnvType.toTypeList(codes);
        Assertions.assertEquals(RuntimeEnvType.MOBILE, list.get(0));
    }

    @Test
    public void runtimeEnvToTypeListWithTwoValuesTest() {
        String codes = "0102";
        List<RuntimeEnvType> list = RuntimeEnvType.toTypeList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void runtimeEnvToTypeListWithRepeatValuesTest() {
        String codes = "01010202";
        List<RuntimeEnvType> list = RuntimeEnvType.toTypeList(codes);
        Assertions.assertEquals(2, list.size());
    }

    @Test
    public void runtimeEnvGetInstallEnvCodeTest() {
        List<String> list = new ArrayList<>();
        list.add("mobile");
        String code = RuntimeEnvType.getRuntimeEnvCode(list);
        Assertions.assertEquals("01", code);
    }

    @Test
    public void runtimeEnvGetInstallEnvCodesTest() {
        List<String> list = new ArrayList<>();
        list.add("mobile");
        list.add("desktop");
        String code = RuntimeEnvType.getRuntimeEnvCode(list);
        Assertions.assertEquals("0102", code);
    }
}
