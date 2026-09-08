import type { BankDAO } from "./bank.dao-database.ts";
import type { UseCase } from "./useCase.ts";

export namespace GetBankList {
  export type Input = unknown;
  export type Output = {
    id: number;
    codigo: string;
    nome: string;
    url: string;
  }[];
}

export class GetBankListUseCase implements UseCase<
  GetBankList.Input,
  GetBankList.Output
> {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(): Promise<GetBankList.Output> {
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
