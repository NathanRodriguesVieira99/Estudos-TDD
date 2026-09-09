import type { BankDAO } from "./bank.dao-database.ts";
import type { UseCase } from "./useCase.ts";

export namespace CreateBank {
  export type Input = {
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

export class CreateBankUseCase implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    if (!input.nome || !input.nome.match(/^.+\s.+$/)) {
      throw new Error("Nome inválido");
    }
    const bankId = await this.bankDAO.save(input);
    const output = {
      id: bankId,
      ...input,
    };
    return output;
  }
}
