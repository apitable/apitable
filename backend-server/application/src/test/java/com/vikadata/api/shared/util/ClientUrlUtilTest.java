package com.vikadata.api.shared.util;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.vikadata.api.shared.util.ClientUriUtil;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * @author tao
 */
public class ClientUrlUtilTest {

    @Test
    void testIsMatchWorkbenchPath() throws URISyntaxException {
        boolean matchWorkbenchPath = ClientUriUtil.isMatchWorkbenchPath(new URI("http://localhost:8080/workbench"));
        assertThat(matchWorkbenchPath).isTrue();
    }

    @Test
    void testIsMatchSharePath() throws URISyntaxException {
        boolean matchSharePath = ClientUriUtil.isMatchSharePath(new URI("http://localhost:8080/share"));
        assertThat(matchSharePath).isTrue();
    }

    @Test
    void testGetShareIdByPath() throws URISyntaxException {
        Optional<String> shareId = ClientUriUtil.getShareIdByPath(new URI("https://vika.cn/share/shrg7yENL1Dg2Ki0zreEg"));
        assertThat(shareId.isPresent()).isTrue();
    }

    @Test
    void testGetNodeIdByPath() throws URISyntaxException {
        Optional<String> nodeId = ClientUriUtil.getNodeIdByPath(new URI("https://vika.cn/workbench/dstDPcNKYv1ND52Tl4/viwsTtTGLAw8T"));
        assertThat(nodeId.isPresent()).isTrue();
    }

    @Test
    void testCheckUrl() {
        Optional<URL> url = ClientUriUtil.checkUrl("https://vika.cn/workbench/dstDPcNKYv1ND52Tl4/viwsTtTGLAw8T");
        assertThat(url.isPresent()).isTrue();
    }

    @Test
    void test() {
        Optional<URI> turnIntoURI = ClientUriUtil.urlTurnIntoURI("https://vika.cn/share/shrg7yENL1Dg2Ki0zreEg ["
                + "Form] - Wu Yitao shared 'node' with you. For a better experience, it is recommended to access it through a computer browser");
        assertThat(turnIntoURI.isPresent()).isTrue();
    }
}
