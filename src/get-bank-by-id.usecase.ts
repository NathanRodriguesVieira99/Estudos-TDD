import type { BankDAO } from "./bank.dao-database.ts";
import type { UseCase } from "./useCase.ts";

export namespace GetBankById {
  export type Input = {
    id: number;
  };
  export type Output =
    | {
        id: number;
        codigo: string;
        nome: string;
        url: string;
      }
    | undefined;
}

export class GetBankByIdUseCase implements UseCase<
  GetBankById.Input,
  GetBankById.Output
> {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: GetBankById.Input): Promise<GetBankById.Output> {
    const row = await this.bankDAO.getById(input.id);
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
