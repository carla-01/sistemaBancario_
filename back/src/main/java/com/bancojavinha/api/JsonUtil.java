package com.bancojavinha.api;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public final class JsonUtil {
    private static final Gson GSON = new Gson();

    private JsonUtil() {
    }

    public static <T> T fromBody(HttpExchange exchange, Class<T> clazz) throws IOException {
        byte[] data = exchange.getRequestBody().readAllBytes();
        String json = new String(data, StandardCharsets.UTF_8);
        return GSON.fromJson(json, clazz);
    }

    public static String toJson(Object value) {
        return GSON.toJson(value);
    }
}
