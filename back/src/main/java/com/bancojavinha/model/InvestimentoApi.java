package com.bancojavinha.model;

public class InvestimentoApi {
    public String conta;
    public String produto;
    public double valor;
    public double taxaAnual;

    public InvestimentoApi(String conta, String produto, double valor, double taxaAnual) {
        this.conta = conta;
        this.produto = produto;
        this.valor = valor;
        this.taxaAnual = taxaAnual;
    }
}
