package com.example.demo.Object;

import lombok.Data;

@Data
public class LoginResponse {
    private boolean success;
    private String message;
    private SignupDTO user;

    public LoginResponse(boolean success, String message, SignupDTO user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }
}
