package com.bancojavinha.api.service;

import com.bancojavinha.api.dto.EmprestimoRequest;
import com.bancojavinha.api.dto.SimularEmprestimoRequest;
import com.bancojavinha.api.memory.Memoria;
import com.bancojavinha.model.ContaApi;
import com.bancojavinha.model.EmprestimoApi;
import com.bancojavinha.model.TransacaoApi;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

public class EmprestimoService {
    private static final DateTimeFormatter DT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    private final Memoria store;
    private final ContaService accountService;

    public EmprestimoService(Memoria store, ContaService accountService) {
        this.store = store;
        this.accountService = accountService;
    }

    public Map<String, Object> simular(SimularEmprestimoRequest req) {
        validar(req.valor, req.parcelas, req.taxaMensal);
        double total = req.valor * Math.pow(1.0 + req.taxaMensal, req.parcelas);
        double parcela = total / req.parcelas;

        return Map.of(
            "valorSolicitado", req.valor,
            "parcelas", req.parcelas,
            "taxaMensal", req.taxaMensal,
            "valorTotal", total,
            "valorParcela", parcela
        );
    }

    public Map<String, Object> criar(EmprestimoRequest req) {
        if (req == null || req.conta == null || req.conta.isBlank()) {
            throw new IllegalArgumentException("Conta obrigatoria");
        }
        
        ContaApi account = accountService.requireAccount(req.conta);
        validar(req.valor, req.parcelas, req.taxaMensal);

        double total = req.valor * Math.pow(1.0 + req.taxaMensal, req.parcelas);
        double parcela = total / req.parcelas;

        EmprestimoApi loan = new EmprestimoApi(req.conta, req.valor, req.parcelas, req.taxaMensal, total, parcela);
        store.loans.add(loan);

        // Adiciona o valor do empréstimo ao saldo da conta
        account.saldo += req.valor;
        
        // Registra a transação no extrato
        account.extrato.add(new TransacaoApi("Emprestimo contratado - Valor recebido", req.valor, now()));
        
        // Registra o compromisso das parcelas (opcional)
        account.extrato.add(new TransacaoApi("Emprestimo contratado - Total de parcelas: " + req.parcelas + "x de " + formatarValor(parcela), 0, now()));

        return Map.of(
            "mensagem", "Emprestimo solicitado com sucesso. O valor foi creditado em sua conta.",
            "emprestimo", loan,
            "saldoAtual", account.saldo
        );
    }

    public List<EmprestimoApi> listarPorConta(String number) {
        accountService.requireAccount(number);
        return store.loans.stream().filter(loan -> loan.conta.equals(number)).toList();
    }

    private void validar(double valor, int parcelas, double taxaMensal) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor do emprestimo invalido");
        }
        if (parcelas <= 0) {
            throw new IllegalArgumentException("Quantidade de parcelas invalida");
        }
        if (taxaMensal < 0) {
            throw new IllegalArgumentException("Taxa mensal invalida");
        }
    }

    private String now() {
        return LocalDateTime.now().format(DT);
    }

    private String formatarValor(double valor) {
        return String.format("R$ %.2f", valor);
    }
}