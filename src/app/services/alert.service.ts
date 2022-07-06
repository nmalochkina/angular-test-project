import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  showWarning(message: string) {
    this.snackBar.open(message, undefined, {panelClass: 'snackbar-warning'});
  }

  showNotification(message: string) {
    this.snackBar.open(message);
  }

  showSuccessMsg(message: string) {
    this.snackBar.open(message, undefined, {panelClass: 'snackbar-success'});
  }
}
