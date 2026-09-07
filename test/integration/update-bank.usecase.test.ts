import * as sinon from "sinon";

import { BankDAO } from "@/bank.dao.ts";
import { UpdateBankUseCase } from "@/update-bank.usecase.ts";

let bankDAO: BankDAO;
let sut: UpdateBankUseCase;

beforeAll(() => {
  bankDAO = new BankDAO();
  sut = new UpdateBankUseCase(bankDAO);
});

afterEach(() => {
  sinon.restore();
});

test("Deve alterar um banco", async () => {
  const inputCreate = {
    codigo: "553",
    nome: "Banco Teste",
    url: "teste.com",
  };
  const bankIdTest = 1;
  sinon.stub(bankDAO, "save").resolves(bankIdTest);
  const bankId = await bankDAO.save(inputCreate);
  const inputUpdate = {
    id: bankId,
    codigo: "553",
    nome: "Banco Teste 2",
    url: "teste2.com",
  };
  const getByIdStub = sinon
    .stub(bankDAO, "getById")
    .resolves({ BANCO_ID: bankIdTest, NOME: "", CODIGO: "", URL: "" });
  sinon.stub(bankDAO, "update").resolves();
  const outputUpdate = await sut.execute(inputUpdate);
  expect(outputUpdate.id).toBe(bankId);
  expect(outputUpdate.codigo).toBe(inputUpdate.codigo);
  expect(outputUpdate.nome).toBe(inputUpdate.nome);
  expect(outputUpdate.url).toBe(inputUpdate.url);
  getByIdStub.resolves({
    BANCO_ID: bankId,
    CODIGO: "553",
    NOME: "Banco Teste 2",
    URL: "teste2.com",
  });
  const outputGet = await bankDAO.getById(bankId);
  expect(outputGet).toBeTruthy();
  expect(outputGet.BANCO_ID).toBe(bankId);
  expect(outputGet.CODIGO).toBe(inputUpdate.codigo);
  expect(outputGet.NOME).toBe(inputUpdate.nome);
  expect(outputGet.URL).toBe(inputUpdate.url);
  sinon.stub(bankDAO, "remove").resolves();
  await bankDAO.remove(bankId);
});
