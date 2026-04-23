import { deposit, formatCurrency, parseMoney } from '../api';
import type { ActionDeps } from './types';

const composeAccountNumber = (tipo: string, numeroInformado: string) => {
  const numeroLimpo = numeroInformado.trim().toUpperCase();
  if (!numeroLimpo) return '';
  if (numeroLimpo.startsWith('CC') || numeroLimpo.startsWith('CP')) {
    return numeroLimpo;
  }
  return `${tipo}${numeroLimpo}`;
};

export const runDepositoAction = async (form: HTMLElement, deps: ActionDeps) => {
  const accountInput = deps.getAccountField(form);
  const tipoInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="tipo"]');
  const valueInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="valor"]');
  const tipo = tipoInput?.value === 'CP' ? 'CP' : 'CC';
  const accountNumber = composeAccountNumber(tipo, accountInput?.value ?? '');
  const value = valueInput?.value ? parseMoney(valueInput.value) : 0;

  if (!accountNumber) {
    deps.setFormMessage(form, 'Informe o numero da conta.');
    return;
  }

  if (value <= 0) {
    deps.setFormMessage(form, 'Informe um valor valido.');
    return;
  }

  try {
    const response = await deposit({ conta: accountNumber, valor: value });
    if (valueInput) valueInput.value = '';
    deps.showPopout(
      `Deposito realizado com sucesso<br>Valor: ${formatCurrency(value)}<br>Conta: ${response.conta ?? accountNumber}`,
    );
    deps.setFormMessage(form, '');
  } catch (error) {
    deps.setFormMessage(form, error instanceof Error ? error.message : 'Erro ao realizar deposito');
  }
};
