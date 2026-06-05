package com.tsarajoro.skillforge.sandbox.runner;

public class SandboxExecutionException extends RuntimeException {
    public SandboxExecutionException(String message) {
        super(message);
    }

    public SandboxExecutionException(String message, Throwable cause) {
        super(message, cause);
    }
}
