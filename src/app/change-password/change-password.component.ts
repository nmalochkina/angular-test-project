import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { IChangePasswordQuery } from '../models/change-password.model';
import { ChangePasswordService } from '../services/change-password.service';

interface PasswordStability {
  numbers: boolean | null,
  uppercase: boolean | null,
  minlength: boolean | null,
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  private passwordControl = new FormControl(null, [Validators.required, this.matchValidator()]);
  private confirmControl = new FormControl(null);

  public formGroup = new FormGroup({
    password: this.passwordControl,
    confirm: this.confirmControl,
  });

  public loading$ = new BehaviorSubject<boolean>(false);
  public showPassword: boolean = false;
  public passwordChangedSuccessfully: boolean | null = null;

  public stability$: Observable<PasswordStability> = this.passwordControl.valueChanges.pipe(
    startWith(this.passwordControl.value),
    map((value: string | null) => this.getPasswordStability(value)),
    shareReplay(),
  );

  get showRequiredError(): boolean {
    return this.passwordControl.hasError('required');
  }
  get showMatchError(): boolean {
    return this.passwordControl.hasError('notMatch') && !this.showRequiredError;
  }

  private token: string | null = null;
  private alive$ = new Subject<void>();

  constructor(
    private changePasswordService: ChangePasswordService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void { 
    this.token = this.route.snapshot.queryParams.token;
    if (!this.token) {
      this.router.navigateByUrl('/');
    }
    this.confirmControl.valueChanges.pipe(
      takeUntil(this.alive$),
    ).subscribe(() => this.passwordControl.updateValueAndValidity());
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  changePassword() {
    if (!this.token || !this.passwordControl.value) {
      return;
    }
    this.loading$.next(true);
    this.formGroup.disable();
    const model: IChangePasswordQuery = {
      token: this.token,
      password: this.passwordControl.value,
    };
    this.changePasswordService.changePassword(model).pipe(
      takeUntil(this.alive$),
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('');
      },
      error: () => {
        this.formGroup.enable();
        this.loading$.next(false);
      }
    })
  }

  private matchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password: string = control.value || '';
      const confirmation: string = this.confirmControl?.value || '';
      const isMatch = password === confirmation;
      return isMatch ? null : {notMatch: true};
    };
  }

  private getPasswordStability(value: string | null): PasswordStability {
    let stability: PasswordStability;
    if (value === null) {
      stability = {
        numbers: null,
        uppercase: null,
        minlength: null,
      };
    } else {
      stability = {
        numbers: /[0-9]/.test(value),
        uppercase: /[A-Z]/.test(value),
        minlength: value.length >= 6,
      };
    }
    return stability;
  }

}