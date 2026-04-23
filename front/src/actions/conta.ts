import { createAccount, formatCurrency, parseMoney } from '../api';
import type { ActionDeps } from './types';

export const runContaAction = async (form: HTMLElement, deps: ActionDeps) => {
  const tipo = form.querySelector<HTMLInputElement>('.calc-display[data-field="tipo"]')?.value ?? 'CC';
  const senhaInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="senha"]');
  const saldoInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="saldo"]');

  if (!senhaInput?.value.trim()) {
    deps.setFormMessage(form, 'Informe a senha para criar a conta.');
    return;
  }

  deps.setFormMessage(form, '');

  try {
    const accountType = tipo === 'CP' ? 'CP' : 'CC';
    const balance = saldoInput?.value ? parseMoney(saldoInput.value) : 0;
    const response = await createAccount({
      tipo: accountType,
      senha: senhaInput.value,
      saldoInicial: balance,
    });

    if (senhaInput) senhaInput.value = '';
    if (saldoInput) saldoInput.value = '';
    deps.showPopout(`Conta criada com sucesso<br>Numero: ${response.numero}<br>Saldo: ${formatCurrency(response.saldo)}`);
  } catch (error) {
    deps.setFormMessage(form, error instanceof Error ? error.message : 'Erro ao criar conta');
  }
};
