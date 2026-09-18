import { validateBankCode } from "@/validate-bank-code.ts";

describe("Validate Bank Code", () => {
  test.each(["", null, undefined, "String", "1", "01"])(
    "deve retornar false se o código '%s' for inválido",
    (invalidCode: any) => {
      const isValid = validateBankCode(invalidCode);
      expect(isValid).toBe(false);
    },
  );
  test("deve retornar true se o código for válido", () => {
    const validCode = "100";
    const isValid = validateBankCode(validCode);
    expect(isValid).toBe(true);
  });
});
