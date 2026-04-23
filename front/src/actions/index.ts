import type { ActionDeps } from './types';
import { runCartoesAction } from './cartoes';
import { runContaAction } from './conta';
import { runDepositoAction } from './deposito';
import { runExtratoAction } from './extrato';
import { runSaqueAction } from './saque';
import { runInvestimentosAction } from './investimentos';
import { runEmprestimosAction } from './emprestimos';

type FormAction = (form: HTMLElement, deps: ActionDeps & { actionType?: string }) => Promise<void> | void;

const handlers: Record<string, FormAction> = {
  conta: runContaAction,
  deposito: runDepositoAction,
  saque: runSaqueAction,
  extrato: runExtratoAction,
  cartoes: runCartoesAction,
  investir: runInvestimentosAction,
  emprestimos: runEmprestimosAction,
};

export const runFormAction = async (
  formType: string, 
  form: HTMLElement, 
  deps: ActionDeps & { actionType?: string }
) => {
  const handler = handlers[formType];
  if (!handler) {
    return false;
  }

  await handler(form, deps);
  return true;
};