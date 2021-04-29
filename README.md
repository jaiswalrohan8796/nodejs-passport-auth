# Authentication in NodeJS using Passport.js
##### This project is a part of my blog [All about Authentication (2/3): Passport.js & OAuth](https://rohanjaiswal.hashnode.dev/all-about-authentication-23-passportjs-and-oauth)
##### It demonstrates use of passport.js with local strategy, Google OAuth strategy, and Facebook OAuth strategy.

### Usage
``` npm install ``` To install all the packages required.

You need to have a mongoDB URI connection string, Google OAuth tokens and Facebook OAuth tokens. Save these files in **.env** file.
```
mongodbURI = <connectionstring>

googleclientID = <id>
googleclientSecret = <token>

facebookclientID = <id>
facebookclientSecret = <token>
```

``` npm start ``` To run this project in development mode.
