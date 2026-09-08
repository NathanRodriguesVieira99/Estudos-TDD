import type { BankDAO } from "./bank.dao-database.ts";

export class GetBankByIdUseCase {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: any): Promise<any> {
    const row = await this.bankDAO.getById(Number(input.id));
    if (!row) return undefined;
    const output = {
      id: row.BANCO_ID,
      codigo: row.CODIGO,
      nome: row.NOME,
      url: row.URL,
    };
    return output;
  }
}
