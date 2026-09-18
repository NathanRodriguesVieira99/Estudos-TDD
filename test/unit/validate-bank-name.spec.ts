import { faker } from "@faker-js/faker";
import { validateBankName } from "@/validate-bank-name.ts";

describe("Validate Bank Name", () => {
  test.each(["", null, undefined, "Teste"])(
    "deve retornar false se o nome '%s' for inválido",
    (invalidName: any) => {
      const isValid = validateBankName(invalidName);
      expect(isValid).toBe(false);
    },
  );
  test("deve retornar true se o nome for válido", () => {
    const validName = faker.person.fullName();
    const isValid = validateBankName(validName);
    expect(isValid).toBe(true);
  });
});
