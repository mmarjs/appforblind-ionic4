import { FacebookUser } from './facebook-user.model';
import { GoogleUser } from './google-user.model';

export class User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  public static mapFromFacebookModel(user: FacebookUser) {
    return new User({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email || user.id
    });
  }

  public static mapFromGoogleModel(user: GoogleUser) {
    return new User({
      firstName: user.givenName,
      lastName: user.familyName,
      email: user.email
    });
  }
}
