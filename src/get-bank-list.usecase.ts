import type { BankDAO } from "./bank.dao-database.ts";

export class GetBankListUseCase {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(): Promise<any> {
    const rows = await this.bankDAO.list();
    const output = rows.map((row) => ({
      id: row.BANCO_ID,
      codigo: row.CODIGO,
      nome: row.NOME,
      url: row.URL,
    }));
    return output;
  }
}
