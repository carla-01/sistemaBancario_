package com.bancojavinha.model;

public class TransacaoApi {
    public String tipo;
    public double valor;
    public String data;

    public TransacaoApi(String tipo, double valor, String data) {
        this.tipo = tipo;
        this.valor = valor;
        this.data = data;
    }
}
