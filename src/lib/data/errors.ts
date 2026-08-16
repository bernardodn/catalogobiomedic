export type DataErrorCode =
  | "not_found"
  | "conflict"
  | "unauthorized"
  | "validation";

export class DataError extends Error {
  constructor(
    public readonly code: DataErrorCode,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DataError {
  constructor(message = "Registro não encontrado.") {
    super("not_found", message);
  }
}

export class ConflictError extends DataError {
  constructor(message = "O registro está em uso ou já existe.") {
    super("conflict", message);
  }
}

export class UnauthorizedError extends DataError {
  constructor(message = "Acesso não autorizado.") {
    super("unauthorized", message);
  }
}

export class ValidationError extends DataError {
  constructor(message = "Os dados informados são inválidos.") {
    super("validation", message);
  }
}
