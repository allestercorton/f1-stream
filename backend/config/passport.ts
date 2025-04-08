import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/user.model.js';
import logger from '../utils/logger.js';
import env from './env.js';

// Make sure these serialization methods are properly defined
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Make sure the Google strategy is properly configured
passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientID,
      clientSecret: env.google.clientSecret,
      callbackURL: `${env.server.url}/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Create new user if doesn't exist
        user = new UserModel({
          googleId: profile.id,
          email: profile.emails?.[0].value || '',
          displayName: profile.displayName,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          profilePicture: profile.photos?.[0].value || '',
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        logger.error('Error in Google strategy:', error);
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
