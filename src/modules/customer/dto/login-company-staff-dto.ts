import { IsNotEmpty } from "class-validator";

export class LoginCustomerDto {
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly token: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly customerId: string;
}
