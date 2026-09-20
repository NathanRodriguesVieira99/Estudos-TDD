import { validateBankCode } from "./validate-bank-code.ts";
import { validateBankName } from "./validate-bank-name.ts";
import type { BankRepository } from "./bank.repository-database.ts";
import type { UseCase } from "./useCase.ts";

export namespace UpdateBank {
  export type Input = {
    id: number;
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

export class UpdateBankUseCase implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private readonly bankRepository: BankRepository) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    if (!validateBankName(input.nome)) throw new Error("Nome inválido");
    if (!validateBankCode(input.codigo)) throw new Error("Código inválido");
    const bank = await this.bankRepository.findById(input.id);
    if (!bank) throw new Error("Banco não encontrado");
    if (bank.getCode() !== input.codigo) {
      const alreadyExistsWithCode = await this.bankRepository.findByCode(
        input.codigo,
      );
      if (alreadyExistsWithCode) {
        throw new Error(
          "Não é possível alterar o banco para um código já cadastrado",
        );
      }
      bank.changeCode(input.codigo);
    }
    if (bank.getName() !== input.nome) {
      const alreadyExistsWithName = await this.bankRepository.findByName(
        input.nome,
      );
      if (alreadyExistsWithName) {
        throw new Error(
          "Não é possível alterar o banco para um nome já cadastrado",
        );
      }
      bank?.changeName(input.nome);
    }
    bank.setUrl(input.url);
    await this.bankRepository.update(bank);
    return {
      id: bank.getId(),
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    };
  }
}
