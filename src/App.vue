<template>
  <div id="app">
    <!-- img src="./assets/logo.png" -->

    <div class="greeting" v-show="!token">
      These are your 8 Weeks to Greatness!!
    </div>

    <div id="google-signin-btn" v-if="!token"></div>

    <div class="greeting" v-show="!token">
      Please log in to record your weekly progress.<br/>You got this!!
    </div>

		<div style="display: none">
			<router-link to="/">Hello</router-link> | 
			<router-link to="/week">Week</router-link>
		</div>

    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
import jwt from 'jsonwebtoken';

var instance = axios.create({
	baseURL: "https://reliacode.com/api/",
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

export default {
  name: 'App', 
  data () {
    return {
      token: null, 
      user_id: null, 
      email: null, 
    }
  },
  methods: {
    processUser (googleUser) {
      // Useful data for your client-side scripts:
      var profile = googleUser.getBasicProfile();
      // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
      // console.log('Full Name: ' + profile.getName());
      // console.log('Given Name: ' + profile.getGivenName());
      // console.log('Family Name: ' + profile.getFamilyName());
      // console.log("Image URL: " + profile.getImageUrl());
      // console.log("Email: " + profile.getEmail());

      // The ID token you need to pass to your backend:
      var id_token = googleUser.getAuthResponse().id_token;
      return id_token;
    },
    onSignIn (googleUser) {
      const self = this;
      var id_token = this.processUser(googleUser);
      // var id_token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyNzY3MWQ3M2EyNjA1Y2NkNDU0NDEzYzRjOTRlMjViM2Y2NmNkZWEifQ.eyJhenAiOiIzODk3Nzc5MzUyMC11NTFiNWtwdmtmdW9rcDJldjl2YjN2bGxma2w2b2Fxby5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjM4OTc3NzkzNTIwLXU1MWI1a3B2a2Z1b2twMmV2OXZiM3ZsbGZrbDZvYXFvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyMzExMDcxODkwNzE4NTkxNDQ2IiwiZW1haWwiOiJkY3ZlenphbmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ2ZlltYS1iOUNtdHE0aGZRZ0FHbDZRIiwiZXhwIjoxNTE4MzAzNDI1LCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiOWFkMjdmODA1MGE3ZWEzMDRiZjZkZGZjZGMyMzRjYTEwYWEyM2E1YSIsImlhdCI6MTUxODI5OTgyNSwibmFtZSI6IkRhdmlkIFZlenphbmkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy0tdXhDTW9vZlcyOC9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ1NJTGpYNnUwUnM1c3UydTZ3VGdSYlhCNXlUUGlXM2xBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJEYXZpZCIsImZhbWlseV9uYW1lIjoiVmV6emFuaSIsImxvY2FsZSI6ImVuIn0.X_0p9NPWZ-1ucCqUqPUrpZ-6NoJ5wOJiX1tIxACztJqIjmSa3u27PulL_bypKRyX4cXqR1EBdhyq7XSzkoIdw6jU0JODFWOjJ6iYCyFWSN9AWJDHg3TP1I1XTPUq6SMT9Cma9yj7zYzwUL8WdakL5IfU3HrbnFhz7ccZ4coik8lyo5oSJ2Mno07HgiVyy_uGhCt-4hFKkZzFOfIhs7-P-8NoMXLCoYgpQRL85cqDDmqTBG-IjgI6gv3SEM1iD0DlVtUT2Dkz9WEqMN5fCrtkavIdQfj2fbLmGMXDmkejJeCV_1pu1bzteZx3Y8fho5YJz3X2JebII16fbW9GdjgEeQ'
      // var id_token = this.token;

      // console.log("ID Token: " + id_token);

      instance.post('/tokensignin', {
          token: id_token,
        })
        .then(function (response) {
          self.token = response.data.token;
          var user = jwt.decode(self.token);
          self.user_id = user.id
          self.email = user.email
          window.Event.$emit("week2:fetchedJwt", self.token)
          
          // console.log(['token', decoded, self.token]);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    signOut () {
      const self = this;
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        window.Event.$emit("week2:fetchedJwt", null)
        setTimeout(() => { 
          self.token = null;
          console.log('User signed out.');
        }, 500);
        setTimeout(() => { 
          window.Event.$emit("loadSignIn"); 
        }, 1000);
      });
    },
  },
  mounted() {
    const self = this;

    window.Event.$on("app:signOut", () => {
      this.signOut();
    });
    window.Event.$on("loadSignIn", () => {
      gapi.signin2.render('google-signin-btn', { // this is the button "id"
        onsuccess: this.onSignIn // note, no "()" here
      });
    });
    setTimeout(() => { 
      window.Event.$emit("loadSignIn");
    }, 500);

    // window.Event.$on("app:fetchJwt", () => { 
    //   console.log("app:fetchJwt");
    //   window.Event.$emit("week2:fetchedJwt", self.token)
    // });

    // this.onSignIn('xxx');
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#google-signin-btn, .g-signin2{
  width: 100%;
}

#google-signin-btn > div, .g-signin2 > div{
  margin: 0 auto;
}

</style>

<style scoped>
.greeting {
  margin: 2em 0;
}
</style>
