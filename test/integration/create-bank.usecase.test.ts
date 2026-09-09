import { faker } from "@faker-js/faker";

import type { BankDAO } from "@/bank.dao-database.ts";
import { CreateBankUseCase } from "@/create-bank.usecase.ts";
import { GetBankByIdUseCase } from "@/get-bank-by-id.usecase.ts";

import { BankDAOFake } from "../mocks/fakes/bank.dao.fake.ts";

let bankDAO: BankDAO;
let getBankByIdUseCase: GetBankByIdUseCase;
let sut: CreateBankUseCase;

beforeEach(() => {
  bankDAO = new BankDAOFake();
  getBankByIdUseCase = new GetBankByIdUseCase(bankDAO);
  sut = new CreateBankUseCase(bankDAO);
});

describe("CreateBank UseCase", () => {
  test("Deve criar um banco", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputSut = {
      codigo: fakeCode,
      nome: "Banco Teste",
      url: "teste.com",
    };
    const outputCreate = await sut.execute(inputSut);
    expect(outputCreate.id).toBeTruthy();
    expect(outputCreate.codigo).toBe(inputSut.codigo);
    expect(outputCreate.nome).toBe(inputSut.nome);
    expect(outputCreate.url).toBe(inputSut.url);
    const inputGet = {
      id: outputCreate.id,
    };
    const outputGet = await getBankByIdUseCase.execute(inputGet);
    expect(outputGet?.id).toBe(outputCreate.id);
    expect(outputGet?.codigo).toBe(outputCreate.codigo);
    expect(outputGet?.nome).toBe(outputCreate.nome);
    expect(outputGet?.url).toBe(outputCreate.url);
    await bankDAO.remove(outputCreate.id);
  });
  test.each(["", null, undefined, "Teste"])(
    "Não deve criar um banco com nome inválido: %s",
    async (invalidName: any) => {
      const inputCreate = {
        codigo: "555",
        nome: invalidName,
        url: "teste.com",
      };
      await expect(sut.execute(inputCreate)).rejects.toThrow("Nome inválido");
    },
  );
  test.each(["", null, undefined, "String", "1", "01"])(
    "Não deve criar um banco com código inválido: %s",
    async (invalidCode: any) => {
      const inputCreate = {
        codigo: invalidCode,
        nome: "Teste Silva",
        url: "teste.com",
      };
      await expect(sut.execute(inputCreate)).rejects.toThrow("Código inválido");
    },
  );
  test("Não deve criar um banco com código repetido", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputCreate = {
      codigo: fakeCode,
      nome: "Teste Silva",
      url: "teste.com",
    };
    const { id } = await sut.execute(inputCreate);
    await expect(sut.execute(inputCreate)).rejects.toThrow(
      "Já existe um banco com este código",
    );
    await bankDAO.remove(id);
  });
  test("Não deve criar um banco com nome repetido", async () => {
    const fakeName = faker.person.fullName();
    const firstInputCreate = {
      codigo: "123",
      nome: fakeName,
      url: "teste.com",
    };
    const { id } = await sut.execute(firstInputCreate);
    const secondInputCreate = {
      codigo: "321",
      nome: firstInputCreate.nome,
      url: firstInputCreate.url,
    };
    await expect(sut.execute(secondInputCreate)).rejects.toThrow(
      "Já existe um banco com este nome",
    );
    await bankDAO.remove(id);
  });
});
