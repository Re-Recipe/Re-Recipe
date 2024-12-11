"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleOauth2_1 = require("./googleOauth2");
const passport = require("passport");
const passport_google_oauth20_with_people_api_1 = require("passport-google-oauth20-with-people-api");
class GooglePassport {
    constructor() {
        this.clientId = googleOauth2_1.default.id;
        this.secretId = googleOauth2_1.default.secret;
        console.log("Google Client ID:", this.clientId);
        console.log("Google Secret ID:", this.secretId);
        passport.use(new passport_google_oauth20_with_people_api_1.Strategy({
            clientID: this.clientId,
            clientSecret: this.secretId,
            callbackURL: "http://localhost:8080/app/auth/google/callback",
        }, (accessToken, refreshToken, profile, done) => {
            console.log("Inside new passport Google strategy");
            process.nextTick(() => {
                console.log('Validating Google profile:', JSON.stringify(profile));
                console.log("userId:", profile.id);
                console.log("displayName:", profile.displayName);
                return done(null, profile);
            });
        }));
        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser((user, done) => {
            done(null, user);
        });
    }
}
exports.default = GooglePassport;
//# sourceMappingURL=GooglePassport.js.map