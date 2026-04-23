package com.bancojavinha.api.service;

import com.bancojavinha.api.dto.ValorRequest;
import com.bancojavinha.api.dto.CriarContaRequest;
import com.bancojavinha.api.memory.Memoria;
import com.bancojavinha.model.ContaApi;
import com.bancojavinha.model.TransacaoApi;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class ContaService {
    private static final DateTimeFormatter DT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    private final Memoria store;
    private final Random random = new Random();

    public ContaService(Memoria store) {
        this.store = store;
    }

    public List<ContaApi> listarContas() {
        return store.accounts.values().stream().toList();
    }

    public ContaApi requireAccount(String number) {
        ContaApi account = store.accounts.get(number);
        if (account == null) {
            throw new IllegalArgumentException("Conta nao encontrada");
        }
        return account;
    }

    public Map<String, Object> criarConta(CriarContaRequest req) {
        String tipo = req.tipo == null ? "CC" : req.tipo.trim().toUpperCase();
        if (!"CC".equals(tipo) && !"CP".equals(tipo)) {
            throw new IllegalArgumentException("Tipo de conta invalido. Use CC ou CP");
        }
        if (req.senha == null || req.senha.isBlank()) {
            throw new IllegalArgumentException("Senha obrigatoria");
        }
        if (req.saldoInicial < 0) {
            throw new IllegalArgumentException("Saldo inicial nao pode ser negativo");
        }

        String numero = gerarNumeroContaUnico(tipo);
        ContaApi account = new ContaApi(numero, tipo, req.senha.trim(), req.saldoInicial);
        account.extrato.add(new TransacaoApi("Conta criada com sucesso", req.saldoInicial, now()));
        store.accounts.put(numero, account);

        return Map.of(
            "mensagem", "Conta criada com sucesso",
            "numero", numero,
            "numeroConta", numero,
            "saldo", account.saldo,
            "tipo", account.tipo
        );
    }

    public Map<String, Object> depositar(ValorRequest req) {
        validarValorRequest(req);
        ContaApi account = requireAccount(req.conta);
        account.saldo += req.valor;
        account.extrato.add(new TransacaoApi("Deposito realizado com sucesso", req.valor, now()));

        return Map.of(
            "mensagem", "Deposito realizado com sucesso",
            "conta", account.numero,
            "saldo", account.saldo
        );
    }

    public Map<String, Object> sacar(ValorRequest req) {
        validarValorRequest(req);
        ContaApi account = requireAccount(req.conta);
        if (account.saldo < req.valor) {
            throw new IllegalArgumentException("Saldo insuficiente");
        }

        account.saldo -= req.valor;
        account.extrato.add(new TransacaoApi("Saque realizado com sucesso", req.valor, now()));

        return Map.of(
            "mensagem", "Saque realizado com sucesso",
            "conta", account.numero,
            "saldo", account.saldo
        );
    }

    public Map<String, Object> extrato(String number) {
        ContaApi account = requireAccount(number);
        return Map.of(
            "numero", account.numero,
            "conta", account.numero,
            "tipo", account.tipo,
            "saldo", account.saldo,
            "extrato", account.extrato,
            "transacoes", account.extrato
        );
    }

    private String gerarNumeroContaUnico(String tipo) {
        int tentativas = 0;
        while (tentativas < 10000) {
            int numero = 100000 + random.nextInt(900000);
            String candidato = tipo + numero;
            if (!store.accounts.containsKey(candidato)) {
                return candidato;
            }
            tentativas++;
        }
        throw new IllegalStateException("Nao foi possivel gerar um numero de conta unico");
    }

    private void validarValorRequest(ValorRequest req) {
        if (req == null || req.conta == null || req.conta.isBlank()) {
            throw new IllegalArgumentException("Conta obrigatoria");
        }
        if (req.valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
    }

    private String now() {
        return LocalDateTime.now().format(DT);
    }
}