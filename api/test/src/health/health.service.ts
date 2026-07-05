import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  working() {
    return 'Working Complete';
  }
}
