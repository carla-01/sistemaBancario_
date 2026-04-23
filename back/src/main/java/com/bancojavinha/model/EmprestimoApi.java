package com.bancojavinha.model;

public class EmprestimoApi {
    public String conta;
    public double valor;
    public int parcelas;
    public double taxaMensal;
    public double total;
    public double parcelaMensal;

    public EmprestimoApi(String conta, double valor, int parcelas, double taxaMensal, double total, double parcelaMensal) {
        this.conta = conta;
        this.valor = valor;
        this.parcelas = parcelas;
        this.taxaMensal = taxaMensal;
        this.total = total;
        this.parcelaMensal = parcelaMensal;
    }
}
