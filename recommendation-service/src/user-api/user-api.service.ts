import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserApiService {
  UserServiceUrl: string;
  constructor(private readonly httpService: HttpService) {
    this.UserServiceUrl = `http://${process.env.USER_SERVICE_HOST}:3000`;
  }

  async getUsersId(): Promise<number[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(this.UserServiceUrl + '/users/recent-ids'),
    );
    return data;
  }
}
