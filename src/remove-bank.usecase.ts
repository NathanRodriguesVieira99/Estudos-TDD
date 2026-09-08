import type { BankDAO } from "./bank.dao-database.ts";
import type { UseCase } from "./useCase.ts";

export namespace RemoveBank {
  export type Input = {
    id: number;
  };
  export type Output = void;
}

export class RemoveBankUseCase implements UseCase<
  RemoveBank.Input,
  RemoveBank.Output
> {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: RemoveBank.Input): Promise<RemoveBank.Output> {
    await this.bankDAO.remove(input.id);
  }
}
