import { BankDAO } from "@/bank.dao-database.ts";
import { UpdateBankUseCase } from "@/update-bank.usecase.ts";

import { BankDAOFake } from "../mocks/bank.dao.fake.ts";

let bankDAO: BankDAO;
let sut: UpdateBankUseCase;

beforeAll(() => {
  bankDAO = new BankDAOFake();
  sut = new UpdateBankUseCase(bankDAO);
});

describe("UpdateBank UseCase", () => {
  test("Deve alterar um banco", async () => {
    const inputCreate = {
      codigo: "553",
      nome: "Banco Teste",
      url: "teste.com",
    };
    const bankId = await bankDAO.save(inputCreate);
    const inputUpdate = {
      id: bankId,
      codigo: "553",
      nome: "Banco Teste 2",
      url: "teste2.com",
    };
    const outputUpdate = await sut.execute(inputUpdate);
    expect(outputUpdate.id).toBe(bankId);
    expect(outputUpdate.codigo).toBe(inputUpdate.codigo);
    expect(outputUpdate.nome).toBe(inputUpdate.nome);
    expect(outputUpdate.url).toBe(inputUpdate.url);
    const outputGet = await bankDAO.getById(bankId);
    expect(outputGet).toBeTruthy();
    expect(outputGet?.BANCO_ID).toBe(bankId);
    expect(outputGet?.CODIGO).toBe(inputUpdate.codigo);
    expect(outputGet?.NOME).toBe(inputUpdate.nome);
    expect(outputGet?.URL).toBe(inputUpdate.url);
    await bankDAO.remove(bankId);
  });
  test.each(["", null, undefined, "Teste"])(
    "Não deve alterar um banco com nome inválido: %s",
    async (invalidName: any) => {
      const inputCreate = {
        codigo: "553",
        nome: "Banco Teste",
        url: "teste.com",
      };
      const bankId = await bankDAO.save(inputCreate);
      const inputUpdate = {
        id: bankId,
        codigo: "553",
        nome: invalidName,
        url: "teste2.com",
      };
      await expect(sut.execute(inputUpdate)).rejects.toThrow("Nome inválido");
      await bankDAO.remove(bankId);
    },
  );
  test.each(["", null, undefined, "String", "1", "01"])(
    "Não deve alterar um banco com código inválido: %s",
    async (invalidCode: any) => {
      const inputCreate = {
        codigo: "553",
        nome: "Banco Teste",
        url: "teste.com",
      };
      const bankId = await bankDAO.save(inputCreate);
      const inputUpdate = {
        id: bankId,
        codigo: invalidCode,
        nome: "Banco Teste 2",
        url: "teste2.com",
      };
      await expect(sut.execute(inputUpdate)).rejects.toThrow("Código inválido");
      await bankDAO.remove(bankId);
    },
  );
});
