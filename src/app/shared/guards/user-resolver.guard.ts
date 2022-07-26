import { ResponseDto } from 'src/app/shared/support/classes/responseDto';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

import { map, Observable } from 'rxjs';

import { VerifyTokenService } from '../support/services/verifyToken/verify-token.service';
import { UserInput } from '../support/interfaces/user/userInput.interface';

@Injectable({
  providedIn: 'root',
})
export class UserResolverGuard implements Resolve<UserInput> {
  constructor(private verifyTokenService: VerifyTokenService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.verifyTokenService.verifyToken().pipe(map((data: ResponseDto<string>) => data.content));
  }
}
