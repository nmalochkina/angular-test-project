import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAuthQuery } from '../models/auth.model';
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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

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
    this.authService.login(model).pipe(
      takeUntil(this.alive$),
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('');
      },
      error: () => {
        this.formGroup.setErrors({unauthorized: true});
        this.loading$.next(false);
      },
    });
  }

}
