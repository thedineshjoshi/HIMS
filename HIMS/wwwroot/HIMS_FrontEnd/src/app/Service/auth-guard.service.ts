import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

export class AuthGuardService{
    constructor(private _authService: AuthService, private _router: Router) {}
  canActivate(): boolean {
    if (this._authService.isTokenExpired()) {
      this._authService.logout();
      this._router.navigate(['/log-in']);
      return false;
    } else {
      return true;
    }
  }
}