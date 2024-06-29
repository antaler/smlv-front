import { ValidatorFn } from "@angular/forms";

export interface InputValidator { validator: ValidatorFn, onError: (error: any) => string | null }
