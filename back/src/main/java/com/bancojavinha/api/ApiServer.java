package com.bancojavinha.api;

import com.bancojavinha.api.dto.ValorRequest;
import com.bancojavinha.api.dto.CartaoRequest;
import com.bancojavinha.api.dto.CriarContaRequest;
import com.bancojavinha.api.dto.InvestimentoRequest;
import com.bancojavinha.api.dto.EmprestimoRequest;
import com.bancojavinha.api.dto.SimularEmprestimoRequest;
import com.bancojavinha.api.service.ContaService;
import com.bancojavinha.api.service.CartaoService;
import com.bancojavinha.api.service.InvestimentoService;
import com.bancojavinha.api.service.EmprestimoService;
import com.bancojavinha.api.memory.Memoria;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Map;

public class ApiServer {
    private final HttpServer server;
    private final ContaService contaService;
    private final CartaoService cartaoService;
    private final InvestimentoService investimentoService;
    private final EmprestimoService emprestimoService;

    public ApiServer(int port) throws IOException {
        this.server = HttpServer.create(new InetSocketAddress(port), 0);

        Memoria store = new Memoria();
        this.contaService = new ContaService(store);
        this.cartaoService = new CartaoService(store, contaService);
        this.investimentoService = new InvestimentoService(store, contaService);
        this.emprestimoService = new EmprestimoService(store, contaService);

        registerRoutes();
    }

    public void start() {
        server.start();
    }

    private void registerRoutes() {
        server.createContext("/api/health", exchange -> handle(exchange, ex -> {
            if (HttpUtil.preflight(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtil.sendMethodNotAllowed(exchange);
                return;
            }
            HttpUtil.sendJson(exchange, 200, Map.of("status", "ok"));
        }));

        server.createContext("/api/contas", exchange -> handle(exchange, ex -> {
            if (HttpUtil.preflight(exchange)) return;

            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtil.sendJson(exchange, 200, contaService.listarContas());
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                CriarContaRequest req = JsonUtil.fromBody(exchange, CriarContaRequest.class);
                HttpUtil.sendJson(exchange, 201, contaService.criarConta(req));
                return;
            }

            HttpUtil.sendMethodNotAllowed(exchange);
        }));

        server.createContext("/api/deposito", exchange -> handle(exchange, ex -> handleAmountOperation(exchange, true)));
        server.createContext("/api/saque", exchange -> handle(exchange, ex -> handleAmountOperation(exchange, false)));

        server.createContext("/api/extrato", exchange -> handle(exchange, ex -> {
            if (HttpUtil.preflight(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtil.sendMethodNotAllowed(exchange);
                return;
            }
            String number = HttpUtil.queryParam(exchange, "conta");
            if (number == null || number.isBlank()) {
                HttpUtil.sendJson(exchange, 400, Map.of("erro", "Informe o parametro conta"));
                return;
            }
            HttpUtil.sendJson(exchange, 200, contaService.extrato(number));
        }));

        server.createContext("/api/cartoes", exchange -> handle(exchange, ex -> {
            if (HttpUtil.preflight(exchange)) return;

            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String number = HttpUtil.queryParam(exchange, "conta");
                if (number == null || number.isBlank()) {
                    HttpUtil.sendJson(exchange, 400, Map.of("erro", "Informe o parametro conta"));
                    return;
                }
                HttpUtil.sendJson(exchange, 200, cartaoService.listarPorConta(number));
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                CartaoRequest req = JsonUtil.fromBody(exchange, CartaoRequest.class);
                HttpUtil.sendJson(exchange, 201, cartaoService.criar(req));
                return;
            }

            HttpUtil.sendMethodNotAllowed(exchange);
        }));

        server.createContext("/api/investimentos", exchange -> handle(exchange, ex -> {
            if (HttpUtil.preflight(exchange)) return;

            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String number = HttpUtil.queryParam(exchange, "conta");
                if (number == null || number.isBlank()) {
                    HttpUtil.sendJson(exchange, 400, Map.of("erro", "Informe o parametro conta"));
                    return;
                }
                HttpUtil.sendJson(exchange, 200, investimentoService.listarPorConta(number));
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                InvestimentoRequest req = JsonUtil.fromBody(exchange, InvestimentoRequest.class);
                HttpUtil.sendJson(exchange, 201, investimentoService.criar(req));
                return;
            }

            HttpUtil.sendMethodNotAllowed(exchange);
        }));

        server.createContext("/api/emprestimos/simular", exchange -> handle(exchange, ex -> {
            if (HttpUtil.preflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtil.sendMethodNotAllowed(exchange);
                return;
            }
            SimularEmprestimoRequest req = JsonUtil.fromBody(exchange, SimularEmprestimoRequest.class);
            HttpUtil.sendJson(exchange, 200, emprestimoService.simular(req));
        }));

        server.createContext("/api/emprestimos", exchange -> handle(exchange, ex -> {
            if (HttpUtil.preflight(exchange)) return;

            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String number = HttpUtil.queryParam(exchange, "conta");
                if (number == null || number.isBlank()) {
                    HttpUtil.sendJson(exchange, 400, Map.of("erro", "Informe o parametro conta"));
                    return;
                }
                HttpUtil.sendJson(exchange, 200, emprestimoService.listarPorConta(number));
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                EmprestimoRequest req = JsonUtil.fromBody(exchange, EmprestimoRequest.class);
                HttpUtil.sendJson(exchange, 201, emprestimoService.criar(req));
                return;
            }

            HttpUtil.sendMethodNotAllowed(exchange);
        }));
    }

    private void handle(HttpExchange exchange, ExchangeAction action) throws IOException {
        try {
            action.run(exchange);
        } catch (IllegalArgumentException e) {
            HttpUtil.sendJson(exchange, 400, Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            HttpUtil.sendJson(exchange, 500, Map.of("erro", "Erro interno no servidor"));
        }
    }

    private void handleAmountOperation(HttpExchange exchange, boolean deposit) throws IOException {
        if (HttpUtil.preflight(exchange)) return;
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtil.sendMethodNotAllowed(exchange);
            return;
        }

        ValorRequest req = JsonUtil.fromBody(exchange, ValorRequest.class);
        if (deposit) {
            HttpUtil.sendJson(exchange, 200, contaService.depositar(req));
        } else {
            HttpUtil.sendJson(exchange, 200, contaService.sacar(req));
        }
    }

    @FunctionalInterface
    private interface ExchangeAction {
        void run(HttpExchange exchange) throws Exception;
    }
}