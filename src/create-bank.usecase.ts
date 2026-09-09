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
    if (!input.nome) throw new Error("Nome inválido");
    if (!input.nome.match(/^.+\s.+$/)) throw new Error("Nome inválido");
    if (!input.codigo) throw new Error("Código inválido");
    if (input.codigo.length !== 3) throw new Error("Código inválido");
    if (input.codigo.replace(/\D/g, "").length !== 3) {
      throw new Error("Código inválido");
    }
    const alreadyExistsWithCode = await this.bankDAO.getByCode(input.codigo);
    if (alreadyExistsWithCode) {
      throw new Error("Já existe um banco com este código");
    }
    const alreadyExistsWithName = await this.bankDAO.getByName(input.nome);
    if(alreadyExistsWithName)throw new Error('Já existe um banco com este nome')
    const bankId = await this.bankDAO.save(input);
    const output = {
      id: bankId,
      ...input,
    };
    return output;
  }
}
