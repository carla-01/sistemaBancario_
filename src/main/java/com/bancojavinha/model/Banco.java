package com.bancojavinha.model;

import java.util.ArrayList;
import java.util.List;

public class Banco {
    private final List<Conta> contas;

    public Banco() {
        contas = new ArrayList<>();
    }

    public void adicionarConta(Conta conta) {
        contas.add(conta);
    }

    public Conta buscarConta(String numeroConta) {
        for(Conta conta : contas) {
            if(conta.getNumeroConta().equals(numeroConta.trim())) {
                return conta;
            }
        }
        return null;
    }

    public List<Conta> getContas() {
        return new ArrayList<>(contas);
    }
}