# CSE110-Project

1. npm install -g firebase-tools
2. firebase login
3. cd website-html (go to root directory of your website project) 
4. firebase init 
choose follows
 (1)hosting
 (2)existing project -> tritongroups 
  ? What do you want to use as your public directory? .
  ? Configure as a single-page app (rewrite all urls to /index.html)? No
  ? Set up automatic builds and deploys with GitHub? (y/N) N
  ? Overwrite 404.html or Index.html file? No, No

5. firebase deploy
6. firebase emulators:start (to test it locally. go to http://localhost:5000/ afterward) (To test on the world wide web, visit https://tritongroups-c26fa.web.app/)