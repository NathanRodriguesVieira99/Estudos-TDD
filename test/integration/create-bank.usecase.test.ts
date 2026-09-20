import { faker } from "@faker-js/faker";
import { CreateBankUseCase } from "@/create-bank.usecase.ts";
import { BankDAOFake } from "../__mocks__/bank.dao-fake.ts";
import { BankRepositoryFake } from "../__mocks__/bank.repository-fake.ts";
import type { BankDAO } from "@/bank.dao-database.ts";
import type { BankRepository } from "@/bank.repository-database.ts";
import { ApplicationError } from "@/application-error.ts";

let bankDAO: BankDAO;
let bankRepository: BankRepository;
let sut: CreateBankUseCase;

beforeEach(() => {
  bankDAO = new BankDAOFake();
  bankRepository = new BankRepositoryFake();
  sut = new CreateBankUseCase(bankRepository);
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
    const bank = await bankRepository.findById(outputCreate.id);
    expect(bank?.getId()).toBe(outputCreate.id);
    expect(bank?.getCode()).toBe(outputCreate.codigo);
    expect(bank?.getName()).toBe(outputCreate.nome);
    expect(bank?.getUrl()).toBe(outputCreate.url);
    await bankDAO.remove(outputCreate.id);
  });
  test("Não deve criar um banco com nome inválido", async () => {
    const invalidName = "";
    const inputCreate = {
      codigo: "555",
      nome: invalidName,
      url: "teste.com",
    };
    await expect(sut.execute(inputCreate)).rejects.toThrow("Nome inválido");
  });
  test("Não deve criar um banco com código inválido", async () => {
    const invalidCode = "";
    const inputCreate = {
      codigo: invalidCode,
      nome: "Teste Silva",
      url: "teste.com",
    };
    await expect(sut.execute(inputCreate)).rejects.toThrow("Código inválido");
  });
  test("Não deve criar um banco com código repetido", async () => {
    const fakeCode = faker.string.numeric(3);
    const inputCreate = {
      codigo: fakeCode,
      nome: "Teste Silva",
      url: "teste.com",
    };
    const { id } = await sut.execute(inputCreate);
    await expect(sut.execute(inputCreate)).rejects.toThrow(
      new ApplicationError("Já existe um banco com este código"),
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
      new ApplicationError("Já existe um banco com este nome"),
    );
    await bankDAO.remove(id);
  });
});
