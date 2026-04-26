import { ErrorBase } from "./base.error.js";

export class EmailAlreadyExists extends ErrorBase {
  constructor(message: string = "O e-mail informado já está vinculado a uma conta!") {
    super(409, message);
  }
}