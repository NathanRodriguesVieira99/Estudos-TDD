import type { BankDAO } from "./bank.dao-database.ts";
import type { UseCase } from "./useCase.ts";

export namespace UpdateBank {
  export type Input = {
    id: number;
    codigo: string;
    nome: string;
    url: string;
  };
  export type Output = {
    id: number;
    codigo: string;
    nome: string;
    url: string;
  };
}

export class UpdateBankUseCase implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    if (!input.nome) throw new Error("Nome inválido");
    if (!input.nome.match(/^.+\s.+$/)) throw new Error("Nome inválido");
    if (!input.codigo) throw new Error("Código inválido");
    if (input.codigo.length !== 3) throw new Error("Código inválido");
    if (input.codigo.replace(/\D/g, "").length !== 3) {
      throw new Error("Código inválido");
    }
    const row = await this.bankDAO.getById(input.id);
    if (!row) throw new Error("Banco não encontrado");
    if (row.CODIGO !== input.codigo) {
      const alreadyExistsWithCode = await this.bankDAO.getByCode(input.codigo);
      if (alreadyExistsWithCode) {
        throw new Error(
          "Não é possível alterar o banco para um código já cadastrado",
        );
      }
    }
    const output = {
      id: row?.BANCO_ID,
      codigo: row?.CODIGO,
      nome: row?.NOME,
      url: row?.URL,
    };
    const updatedBank = {
      ...output,
      ...input,
    };
    await this.bankDAO.update(updatedBank);
    return updatedBank;
  }
}
