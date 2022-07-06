import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private readonly baseConfig: MatSnackBarConfig = {
    duration: 3000,
  };

  constructor(
    private snackBar: MatSnackBar
  ) { }

  showWarning(message: string) {
    this.snackBar.open(message, undefined, {
      ...this.baseConfig,
      panelClass: 'snackbar-warning',
    });
  }

  showNotification(message: string) {
    this.snackBar.open(message, undefined, {
      ...this.baseConfig,
    });
  }

  showSuccessMsg(message: string) {
    this.snackBar.open(message, undefined, {
      ...this.baseConfig,
      panelClass: 'snackbar-success',
    });
  }
}
