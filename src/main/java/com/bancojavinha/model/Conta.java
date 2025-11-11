package com.bancojavinha.model;

import com.bancojavinha.service.OperacoesConta;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;

public abstract class Conta implements OperacoesConta {
    protected String numeroConta;
    protected double saldo;
    private String senha;
    protected List<String> extrato;

    public Conta(String numeroConta, double saldoInicial, String senha) {
        this.numeroConta = numeroConta;
        this.saldo = saldoInicial;
        this.senha = senha;
        this.extrato = new ArrayList<>();
        registrarExtrato("Conta criada com saldo inicial de: " + formatarValor(saldoInicial));
    }

    public String getNumeroConta() { 
        return numeroConta; 
    }
    
    public double getSaldo() { 
        return saldo; 
    }
    
    protected void setSaldo(double saldo) { 
        this.saldo = saldo; 
    }
    
    public boolean validarSenha(String senha) {
        return this.senha.equals(senha);
    }

    protected void registrarExtrato(String operacao) {
        extrato.add(operacao);
    }

    @Override
    public void exibirExtrato() {
        System.out.println("Extrato da Conta " + numeroConta + ":");
        for(String operacao : extrato) {
            System.out.println(operacao);
        }
    }

    protected String formatarValor(double valor) {
        return NumberFormat.getCurrencyInstance().format(valor);
    }

    @Override
    public String toString() {
        return "Conta [Número=" + numeroConta + ", Saldo=" + formatarValor(saldo) + "]";
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;
        if(obj == null || getClass() != obj.getClass()) return false;
        Conta conta = (Conta) obj;
        return numeroConta.equals(conta.numeroConta);
    }
}