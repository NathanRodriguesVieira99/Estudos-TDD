import { Bank } from "@/bank.ts";

describe("Bank", () => {
  it("deve criar um Banco", () => {
    const name = "Teste Banco Name";
    const code = "009";
    const url = "url.com";
    const instance = Bank.create({ name, code, url });
    expect(instance).toBeTruthy();
    expect(instance.getId()).toBeDefined();
    expect(instance.getName()).toBe(name);
    expect(instance.getCode()).toBe(code);
    expect(instance.getUrl()).toBe(url);
  });
  it("deve restaurar um Banco", () => {
    const id = 0;
    const name = "Teste Banco Name";
    const code = "009";
    const url = "url.com";
    const instance = Bank.restore({ id, name, code, url });
    expect(instance).toBeTruthy();
    expect(instance.getId()).toBe(id);
    expect(instance.getName()).toBe(name);
    expect(instance.getCode()).toBe(code);
    expect(instance.getUrl()).toBe(url);
  });
  it("deve alterar propriedades do Banco", () => {
    const id = 9;
    const name = "Teste Banco Name";
    const code = "009";
    const url = "url.com";
    const updatedName = "Teste Banco Name Updated";
    const updatedCode = "019";
    const updatedUrl = "url.updated.com";
    const instance = Bank.restore({ id, name, code, url });
    instance.setName(updatedName);
    instance.setCode(updatedCode);
    instance.setUrl(updatedUrl);
    expect(instance).toBeTruthy();
    expect(instance.getName()).toBe(updatedName);
    expect(instance.getCode()).toBe(updatedCode);
    expect(instance.getUrl()).toBe(updatedUrl);
  });
});
