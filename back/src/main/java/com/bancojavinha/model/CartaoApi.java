package com.bancojavinha.model;

public class CartaoApi {
    public String conta;
    public String tipo;
    public String finalCartao;
    public double limite;

    public CartaoApi(String conta, String tipo, String finalCartao, double limite) {
        this.conta = conta;
        this.tipo = tipo;
        this.finalCartao = finalCartao;
        this.limite = limite;
    }
}
