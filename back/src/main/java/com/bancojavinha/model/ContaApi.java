package com.bancojavinha.model;

import java.util.ArrayList;
import java.util.List;

public class ContaApi {
    public String numero;
    public String tipo;
    public String senha;
    public double saldo;
    public List<TransacaoApi> extrato = new ArrayList<>();

    public ContaApi(String numero, String tipo, String senha, double saldo) {
        this.numero = numero;
        this.tipo = tipo;
        this.senha = senha;
        this.saldo = saldo;
    }
}