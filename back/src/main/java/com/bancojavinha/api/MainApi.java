package com.bancojavinha.api;

public class MainApi {
    public static void main(String[] args) throws Exception {
        ApiServer server = new ApiServer(8080);
        server.start();
        System.out.println("API Dridri Bank iniciada em http://localhost:8080");
        System.out.println("Pressione Ctrl+C para encerrar.");
    }
}
