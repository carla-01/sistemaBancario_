import { createCard, parseMoney } from '../api';
import type { ActionDeps } from './types';

export const runCartoesAction = async (form: HTMLElement, deps: ActionDeps) => {
  const accountInput = deps.getAccountField(form, 'conta');
  const tipoInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="tipo"]');
  const finalInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="final"]');
  const limiteInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="limite"]');

  const accountNumber = accountInput?.value.trim();
  const tipo = tipoInput?.value?.trim() || 'CC';
  const finalCartao = finalInput?.value?.trim();
  const limite = limiteInput?.value ? parseMoney(limiteInput.value) : 0;

  if (!accountNumber) {
    deps.setFormMessage(form, 'Selecione uma conta para criar o cartão.');
    return;
  }

  if (!finalCartao || finalCartao.length !== 4) {
    deps.setFormMessage(form, 'Informe os últimos 4 dígitos do cartão.');
    return;
  }

  if (limite <= 0) {
    deps.setFormMessage(form, 'Informe um limite válido.');
    return;
  }

  try {
    await createCard({
      conta: accountNumber,
      tipo: tipo === 'CP' ? 'CP' : 'CC',
      finalCartao,
      limite,
    });

    if (finalInput) finalInput.value = '';
    if (limiteInput) limiteInput.value = '';
    deps.setFormMessage(form, '');
    deps.showPopout(`Cartao gerenciado com sucesso<br>Conta: ${accountNumber}<br>Final: ${finalCartao}`);
  } catch (error) {
    deps.setFormMessage(form, error instanceof Error ? error.message : 'Erro ao gerenciar cartão');
  }
};
