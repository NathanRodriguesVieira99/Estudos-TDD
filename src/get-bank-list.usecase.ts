import type { UseCase } from "./useCase.ts";
import type { BankRepository } from "./bank.repository-database.ts";

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
  constructor(private readonly bankRepository: BankRepository) {}

  async execute(): Promise<GetBankList.Output> {
    const bankList = await this.bankRepository.list();
    const output = bankList.map((bank) => ({
      id: bank.getId(),
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    }));
    return output;
  }
}
