

import { Customer } from "./../../../graphql.schema";

export interface CustomerData extends Customer {
  token?: any;
  password?: string;
}

export interface CustomerRO {
  customer: CustomerData;
}
