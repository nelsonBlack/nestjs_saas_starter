import { TokenResponseDto } from "./../dto/sms-response.dto";
export class ISmsResponse {
  SMSMessageData: SmsResponseData;
}

export class SmsResponseData {
  Message: String;
  Recipients: TokenResponseDto[];
}
