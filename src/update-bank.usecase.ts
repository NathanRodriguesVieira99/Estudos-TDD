import type { BankDAO } from "./bank.dao-database.ts";

export class UpdateBankUseCase {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: any) {
    const row = await this.bankDAO.getById(Number(input.id));
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
