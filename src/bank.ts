/*
 * Conceito de Domínio Anêmico e Domínio Rico:
 * Domínio Anêmico é quando a entidade possui apenas Getters e Setters, ela não se auto-valida (não possui inteligência).
 * Domínio Rico é quando a entidade se auto-valida, possui inteligência.
 */

/*
 * DRY (Don't Repeat Yourself): evitar repetição/duplicação de código,testes, documentações.
 * Quando começar a repetir muito deve-se quebrar em abstrações,como funções,classes etc, que são reutilizáveis.
 */

import { validateBankCode } from "./validate-bank-code.ts";
import { validateBankName } from "./validate-bank-name.ts";

export namespace Bank {
  export type CreateParams = {
    name: string;
    code: string;
    url: string;
  };
  export type RestoreParams = {
    id: number;
    name: string;
    code: string;
    url: string;
  };
}

export class Bank {
  private constructor(
    private id: number,
    private name: string,
    private code: string,
    private url: string,
  ) {
    if (!validateBankName(name)) throw new Error("Nome inválido");
    if (!validateBankCode(code)) throw new Error("Código inválido");
  }

  /*
   * Static Factory Method: método estático que cria e retorna instancias.
   * Isso encapsula a logica apenas para a própria classe.
   * O construtor privado impede o uso de 'new' externamente, forçando a criação ser via esses métodos.
   */
  static create({ name, code, url }: Bank.CreateParams): Bank {
    return new Bank(0, name, code, url);
  }

  static restore({ id, name, code, url }: Bank.RestoreParams): Bank {
    return new Bank(id, name, code, url);
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCode(): string {
    return this.code;
  }

  getUrl(): string {
    return this.url;
  }

  setName(name: string): void {
    this.name = name;
  }

  setCode(code: string): void {
    this.code = code;
  }

  setUrl(url: string): void {
    this.url = url;
  }
}
