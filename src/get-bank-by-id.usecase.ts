import type { BankRepository } from "./bank.repository-database.ts";
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
  constructor(private readonly bankRepository: BankRepository) {}

  async execute(input: GetBankById.Input): Promise<GetBankById.Output> {
    const bank = await this.bankRepository.findById(input.id);
    if (!bank) return undefined;
    const output = {
      id: bank.getId(),
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    };
    return output;
  }
}
