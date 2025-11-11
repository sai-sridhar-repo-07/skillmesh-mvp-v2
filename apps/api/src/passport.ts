import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "./models/User";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/api/auth/google/callback"
}, async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(null, false);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName || email.split("@")[0],
        email,
        passwordHash: null,
        verified: true,
        roles: ["learner"]
      });
    }
    return done(null, user);
  } catch (e) {
    done(e);
  }
}));

export default passport;
