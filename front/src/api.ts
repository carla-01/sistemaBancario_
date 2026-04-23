const API_BASE = 'http://localhost:8080/api';

// Utility functions
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const parseMoney = (value: string) => {
  const cleaned = value.replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

export interface ApiError {
  erro: string;
}

export const isError = (data: unknown): data is ApiError => {
  return typeof data === 'object' && data !== null && 'erro' in data;
};

export const apiCall = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: unknown,
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, options);
  } catch {
    throw new Error('Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.');
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || isError(data)) {
    const errorMsg = isError(data) ? data.erro : 'Erro ao conectar com o servidor';
    throw new Error(errorMsg);
  }

  return data as T;
};

// Contas
export interface CreateAccountRequest {
  tipo: 'CC' | 'CP';
  senha: string;
  saldoInicial: number;
}

export interface CreateAccountResponse {
  numero: string;
  tipo: string;
  saldo: number;
}

export const createAccount = async (data: CreateAccountRequest) => {
  const raw = await apiCall<Record<string, unknown>>('/contas', 'POST', data);
  return {
    numero: String(raw.numero ?? raw.numeroConta ?? ''),
    tipo: String(raw.tipo ?? data.tipo),
    saldo: Number(raw.saldo ?? data.saldoInicial ?? 0),
  } as CreateAccountResponse;
};

export const listAccounts = () =>
  apiCall<Array<{ numero: string; tipo: string; saldo: number }>>('/contas', 'GET');

// Operações
export interface AmountRequest {
  conta: string;
  valor: number;
}

export const deposit = (data: AmountRequest) => apiCall<{ saldo: number; conta?: string }>('/deposito', 'POST', data);

export const withdraw = (data: AmountRequest) => apiCall<{ saldo: number; conta?: string }>('/saque', 'POST', data);

// Extrato
export interface Transaction {
  tipo: string;
  valor: number;
  data: string;
}

export interface StatementResponse {
  numero: string;
  tipo: string;
  saldo: number;
  extrato: Transaction[];
}

export const getStatement = async (accountNumber: string) => {
  const raw = await apiCall<Record<string, unknown>>(`/extrato?conta=${accountNumber}`, 'GET');
  return {
    numero: String(raw.numero ?? raw.conta ?? accountNumber),
    tipo: String(raw.tipo ?? ''),
    saldo: Number(raw.saldo ?? 0),
    extrato: Array.isArray(raw.extrato)
      ? (raw.extrato as Transaction[])
      : Array.isArray(raw.transacoes)
        ? (raw.transacoes as Transaction[])
        : [],
  } as StatementResponse;
};

// Cartões
export interface CardRequest {
  conta: string;
  tipo: string;
  finalCartao: string;
  limite: number;
}

export interface CardResponse {
  conta: string;
  tipo: string;
  finalCartao: string;
  limite: number;
}

export const createCard = (data: CardRequest) =>
  apiCall<CardResponse>('/cartoes', 'POST', data);

export const listCards = (accountNumber: string) =>
  apiCall<CardResponse[]>(`/cartoes?conta=${accountNumber}`, 'GET');

// Investimentos
export interface InvestmentRequest {
  conta: string;
  produto: string;
  valor: number;
  taxaAnual: number;
}

export interface InvestmentResponse {
  conta: string;
  produto: string;
  valor: number;
  taxaAnual: number;
}

export const createInvestment = (data: InvestmentRequest) =>
  apiCall<InvestmentResponse>('/investimentos', 'POST', data);

export const listInvestments = (accountNumber: string) =>
  apiCall<InvestmentResponse[]>(`/investimentos?conta=${accountNumber}`, 'GET');

// Empréstimos
export interface LoanSimulationRequest {
  valor: number;
  parcelas: number;
  taxaMensal: number;
}

export interface LoanSimulationResponse {
  valor: number;
  parcelas: number;
  taxaMensal: number;
  total: number;
  parcelaMensal: number;
}

export const simulateLoan = (data: LoanSimulationRequest) =>
  apiCall<LoanSimulationResponse>('/emprestimos/simular', 'POST', data);

export interface LoanRequest extends LoanSimulationRequest {
  conta: string;
  senha: string;
}

export interface LoanResponse extends LoanSimulationResponse {
  conta: string;
  saldoAtual?: number;  
}

export const createLoan = (data: LoanRequest) =>
  apiCall<LoanResponse>('/emprestimos', 'POST', data);

export const listLoans = (accountNumber: string) =>
  apiCall<LoanResponse[]>(`/emprestimos?conta=${accountNumber}`, 'GET');