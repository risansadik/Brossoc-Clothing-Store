const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');
const env = require('dotenv');
const session = require('express-session');

const clientID = (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.trim()) ? process.env.GOOGLE_CLIENT_ID : 'placeholder_google_client_id';
const clientSecret = (process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET.trim()) ? process.env.GOOGLE_CLIENT_SECRET : 'placeholder_google_client_secret';

passport.use(new googleStrategy({
    clientID,
    clientSecret,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://brossoc.binsadik.online/auth/google/callback' : '/auth/google/callback',
    passReqToCallback: true 
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        
       
        let user = await User.findOne({ googleId: profile.id });
        
      
        if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            
            if (user) {
               
                user.googleId = profile.id;
                await user.save();
            } else {
                // Create new user
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isAdmin: false,
                    isBlocked: false
                });
                await user.save();
            }
        }

       
        if (user.isBlocked) {
            return done(null, false, { message: 'Your account has been blocked' });
        }

        return done(null, user);
    } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.error('Deserialize Error:', err);
        done(err, null);
    }
});
module.exports = passport;

