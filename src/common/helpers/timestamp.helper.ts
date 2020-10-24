import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeStampHelper {
    public getTimeStamp(): number {
        console.log(new Date().getTime());
        return new Date().getTime();
      }
}