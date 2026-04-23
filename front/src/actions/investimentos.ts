import { createInvestment, parseMoney } from '../api';
import type { ActionDeps } from './types';

export const runInvestimentosAction = async (form: HTMLElement, deps: ActionDeps) => {
  const accountInput = deps.getAccountField(form, 'conta');
  const produtoInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="produto"]');
  const valorInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="valor"]');
  const taxaInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="taxa"]');

  const accountNumber = accountInput?.value.trim();
  const produto = produtoInput?.value.trim() || 'CDB';
  const valor = valorInput?.value ? parseMoney(valorInput.value) : 0;
  const taxaAnual = taxaInput?.value ? parseMoney(taxaInput.value) : 0;

  if (!accountNumber) {
    deps.setFormMessage(form, 'Selecione uma conta para investir.');
    return;
  }

  if (valor <= 0) {
    deps.setFormMessage(form, 'Informe um valor válido.');
    return;
  }

  try {
    await createInvestment({
      conta: accountNumber,
      produto,
      valor,
      taxaAnual,
    });

    if (valorInput) valorInput.value = '';
    if (taxaInput) taxaInput.value = '';
    deps.setFormMessage(form, '');
    deps.showPopout(`Investimento criado com sucesso<br>Conta: ${accountNumber}<br>Produto: ${produto}`);
  } catch (error) {
    deps.setFormMessage(form, error instanceof Error ? error.message : 'Erro ao criar investimento');
  }
};
