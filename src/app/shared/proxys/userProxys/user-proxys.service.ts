import { Router } from '@angular/router';
import { ResponseGetUserByIdDto } from 'src/app/shared/support/classes/responseGetUserByIdDto';
import { ResponseDto } from 'src/app/shared/support/classes/responseDto';
import { CommonService } from '../../support/services/common.service';
import { Observable, catchError, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInput } from '../../support/interfaces/user/userInput.interface';

import { UserProxysInterface } from './user-proxys.interface';

@Injectable({
  providedIn: 'root',
})
export class UserProxysService implements UserProxysInterface {
  private basePath = 'http://localhost:51235/users/';

  constructor(private httpClient: HttpClient, private commonService: CommonService, private router: Router) {}
  public createNewUserRequest(user: UserInput): Observable<ResponseDto> {
    return <Observable<ResponseDto>>this.httpClient.post(`${this.basePath}add`, user);
  }
  public getUserByIdRequest(id: string): Observable<ResponseGetUserByIdDto> {
    const headers = this.commonService.getHeaders();
    return <Observable<any>>this.httpClient.get(`${this.basePath}${id}`, { headers }).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.commonService.logout();
          }
        },
      })
    );
  }
  public updateUserRequest(userId: string, user: UserInput): Observable<ResponseDto> {
    const headers = this.commonService.getHeaders();

    return <Observable<any>>this.httpClient.put(`${this.basePath}${userId}`, user, { headers }).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.commonService.logout();
          }
        },
      })
    );
  }
}
