import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { IAuthQuery } from '../models/auth.model';
import { IChangePasswordQuery } from '../models/change-password.model';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor() { }

  changePassword(model: IChangePasswordQuery): Observable<unknown> {
    return timer(400);
  }
}
