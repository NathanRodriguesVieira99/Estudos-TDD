import { Bank } from "./bank.ts";
import type { UseCase } from "./useCase.ts";
import type { BankRepository } from "./bank.repository-database.ts";

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
  constructor(private readonly bankRepository: BankRepository) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    const bank = Bank.create({
      name: input.nome,
      code: input.codigo,
      url: input.url,
    });
    const alreadyExistsWithCode = await this.bankRepository.findByCode(
      input.codigo,
    );
    if (alreadyExistsWithCode) {
      throw new Error("Já existe um banco com este código");
    }
    const alreadyExistsWithName = await this.bankRepository.findByName(
      input.nome,
    );
    if (alreadyExistsWithName) {
      throw new Error("Já existe um banco com este nome");
    }
    const savedBank = await this.bankRepository.save(bank);
    const output = {
      id: savedBank.getId(),
      nome: savedBank.getName(),
      codigo: savedBank.getCode(),
      url: savedBank.getUrl(),
    };
    return output;
  }
}
