package com.bancojavinha.service;

public interface OperacoesConta {
    void sacar(double valor, String data);
    void depositar(double valor, String data);
    boolean transferir(double valor, String data, String numeroConta);
    void mostrarTransferencia(double valor, String data, String numeroConta);
    void exibirExtrato();
}