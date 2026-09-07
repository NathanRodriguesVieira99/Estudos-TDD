import { BankDAO } from "./bank.dao.ts";

export class UpdateBankUseCase {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: any) {
    const row = await this.bankDAO.getById(input.id);
    const output = {
      id: row.BANCO_ID,
      codigo: row.CODIGO,
      nome: row.NOME,
      url: row.URL,
    };
    const updatedBank = {
      ...output,
      ...input,
    };
    await this.bankDAO.update(updatedBank);
    return updatedBank;
  }
}
