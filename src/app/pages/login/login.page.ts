import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { SocialLoginType } from 'src/app/shared/models/social-login-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public readonly socialLoginType: typeof SocialLoginType = SocialLoginType;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router) {  }

  ngOnInit() { }

  public socialLogin(type: SocialLoginType): void {
    this.authService.socialLogin(type).subscribe((success: boolean) => {
      if (success) {
        this.navigateToRoot();
      }
    });
  }

  private navigateToRoot(): void {
    this.router.navigate(['']);
  }
}
