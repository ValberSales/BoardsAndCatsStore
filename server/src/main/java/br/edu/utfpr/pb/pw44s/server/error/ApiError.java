package br.edu.utfpr.pb.pw44s.server.error;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
public class ApiError {
    private final long timestamp = System.currentTimeMillis();
    private String message;
    private int status;
    private String url;
    private Map<String, String> validationErrors;

    public ApiError(String message, int status, String url) {
        this.message = message;
        this.status = status;
        this.url = url;
    }

    public ApiError(String message, int status, String url, Map<String, String> validationErrors) {
        this.message = message;
        this.status = status;
        this.url = url;
        this.validationErrors = validationErrors;
    }
}