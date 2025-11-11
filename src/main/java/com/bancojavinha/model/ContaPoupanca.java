package com.bancojavinha.model;

public class ContaPoupanca extends Conta {
    public ContaPoupanca(String numeroConta, double saldoInicial, String senha) {
        super(numeroConta, saldoInicial, senha);
    }

    @Override
    public void mostrarTransferencia(double valor, String data, String numeroConta) {
        double saldoAntes = getSaldo();
        setSaldo(getSaldo() + valor);
        registrarExtrato("Transferência de " + formatarValor(valor) + " em " + data + 
                        " da conta " + numeroConta + ".\nSaldo antes: " + 
                        formatarValor(saldoAntes) + "\nSaldo após: " + formatarValor(getSaldo()));
    }

    @Override
    public boolean transferir(double valor, String data, String numeroConta) {
        if(getSaldo() >= valor) {
            double saldoAntes = getSaldo();
            setSaldo(getSaldo() - valor);
            registrarExtrato("Transferência de " + formatarValor(valor) + " em " + data + 
                            " para a conta " + numeroConta + ".\nSaldo antes: " + 
                            formatarValor(saldoAntes) + "\nSaldo após: " + formatarValor(getSaldo()));
            return true;
        } else {
            System.out.println("Saldo insuficiente na Conta Poupança.");
            return false;
        }
    }

    @Override
    public void sacar(double valor, String data) {
        if(getSaldo() >= valor) {
            double saldoAntes = getSaldo();
            setSaldo(getSaldo() - valor);
            registrarExtrato("Saque de " + formatarValor(valor) + " em " + data + 
                            ".\nSaldo antes: " + formatarValor(saldoAntes) + 
                            "\nSaldo após: " + formatarValor(getSaldo()));
            System.out.println("Saque realizado com sucesso na Conta Poupança.");
        } else {
            System.out.println("Saldo insuficiente na Conta Poupança.");
        }
    }

    @Override
    public void depositar(double valor, String data) {
        double saldoAntes = getSaldo();
        setSaldo(getSaldo() + valor);
        registrarExtrato("Depósito de " + formatarValor(valor) + " em " + data + 
                        ".\nSaldo antes: " + formatarValor(saldoAntes) + 
                        "\nSaldo após: " + formatarValor(getSaldo()));
        System.out.println("Depósito realizado com sucesso na Conta Poupança.");
    }
}