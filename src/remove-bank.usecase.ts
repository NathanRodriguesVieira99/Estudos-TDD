import type { BankRepository } from "./bank.repository-database.ts";
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
  constructor(private readonly bankRepository: BankRepository) {}

  async execute(input: RemoveBank.Input): Promise<RemoveBank.Output> {
    await this.bankRepository.remove(input.id);
  }
}
