import { BankDAO } from "@/bank.dao-database.ts";
import { UpdateBankUseCase } from "@/update-bank.usecase.ts";

import { BankDAOFake } from "../mocks/fakes/bank.dao.fake.ts";

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
  test("Não deve alterar um banco inexistente", async () => {
    const inputUpdate = {
      id: 9_999_999,
      codigo: "666",
      nome: "Banco Teste 2",
      url: "teste2.com",
    };
    await expect(sut.execute(inputUpdate)).rejects.toThrow(
      "Banco não encontrado",
    );
  });
  test("Não deve alterar um banco para um código já existente", async () => {
    const firstInputCreate = {
      codigo: "553",
      nome: "Banco Teste",
      url: "teste.com",
    };
    const firstBankId = await bankDAO.save(firstInputCreate);
    const secondInputCreate = {
      codigo: "554",
      nome: "Banco Teste",
      url: "teste.com",
    };
    const secondBankId = await bankDAO.save(secondInputCreate);
    const inputUpdate = {
      id: firstBankId,
      codigo: "554",
      nome: "Banco Teste 2",
      url: "teste2.com",
    };
    await expect(sut.execute(inputUpdate)).rejects.toThrow(
      "Não é possível alterar o banco para um código já cadastrado",
    );
    await bankDAO.remove(firstBankId);
    await bankDAO.remove(secondBankId);
  });
  test("Não deve alterar um banco para um nome já existente", async () => {
    const firstInputCreate = {
      codigo: "553",
      nome: "Test Name",
      url: "teste4.com",
    };
    const firstBankId = await bankDAO.save(firstInputCreate);
    const secondInputCreate = {
      codigo: '553',
      nome: "Banco Teste Changed",
      url: "teste4.com",
    };
    const secondBankId = await bankDAO.save(secondInputCreate);
    const inputUpdate = {
      id: firstBankId,
      codigo: firstInputCreate.codigo,
      nome: secondInputCreate.nome,
      url: "teste4.changed.com",
    };
    await expect(sut.execute(inputUpdate)).rejects.toThrow(
      "Não é possível alterar o banco para um nome já cadastrado",
    );
    await bankDAO.remove(firstBankId);
    await bankDAO.remove(secondBankId);
  });
});
