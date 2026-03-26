const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
 new GoogleStrategy(
  {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {

   let user = await User.findOne({ email: profile.emails[0].value });

   if (!user) {
     user = await User.create({
       name: profile.displayName,
       email: profile.emails[0].value
     });
   }

   return done(null, user);
  }
 )
);