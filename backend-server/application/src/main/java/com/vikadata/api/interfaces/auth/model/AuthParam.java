package com.vikadata.api.interfaces.auth.model;

public class AuthParam {

    private String username;

    private String password;

    public AuthParam(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
