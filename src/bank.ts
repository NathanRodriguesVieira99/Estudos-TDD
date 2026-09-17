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
  // * O construtor privado impede o uso de 'new' externamente, forçando a criação ser via esses métodos.
  private constructor(
    private id: number,
    private name: string,
    private code: string,
    private url: string,
  ) {}

  /*
   * Static Factory Method: método estático que cria e retorna instancias.
   * Isso encapsula a logica apenas para a própria classe.
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
