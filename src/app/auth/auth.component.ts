import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAuthQuery } from '../models/auth.model';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit, OnDestroy {

  public formGroup = new FormGroup({
    login: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  public loading$ = new BehaviorSubject<boolean>(false);
  public showPassword = false;

  private alive$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const model: IAuthQuery = this.formGroup.value;
    this.loading$.next(true);
    this.formGroup.disable();
    this.authService.login(model).pipe(
      takeUntil(this.alive$),
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('');
      },
      error: () => {
        this.alertService.showWarning('Oops, something went wrong');
        this.formGroup.enable();
        this.loading$.next(false);
      },
    });
  }

}
