import { getById, list, remove, save, update } from "@/database.ts";

test("Deve testar o acesso ao banco", async () => {
  const bankId = await save({
    codigo: "123",
    nome: "nome",
    url: "url",
  });
  const listBank = await list();
  const exists = listBank.find((bank) => bank.BANCO_ID === bankId);
  expect(exists).toBeTruthy();
  expect(exists.CODIGO).toBe("123");
  expect(exists.NOME).toBe("nome");
  expect(exists.URL).toBe("url");
  await update({
    id: bankId,
    codigo: "321",
    nome: "nome alterado",
    url: "url alterada",
  });
  const updatedBank = await getById(bankId);
  console.log(updatedBank);
  expect(updatedBank).toBeTruthy();
  expect(updatedBank.CODIGO).toBe("321");
  expect(updatedBank.NOME).toBe("nome alterado");
  expect(updatedBank.URL).toBe("url alterada");
  await remove(bankId);
  const bankData = await getById(bankId);
  expect(bankData).toBeFalsy();
});
