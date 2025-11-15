import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const email = emails[0].value;

        // Procura usuário por GoogleID ou Email
        let user = await UserModel.findOne({
          $or: [{ googleId: id }, { email }],
        });

        if (!user) {
          // cria novo usuário
          user = await UserModel.create({
            googleId: id,
            name: displayName,
            email,
            avatar: photos[0].value,
          });
        } else if (!user.googleId) {
          // vincula conta existente ao google
          user.googleId = id;
          user.avatar = photos[0].value;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
