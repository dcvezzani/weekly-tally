<template>
  <div id="app">
    <!-- img src="./assets/logo.png" -->

		<div style="display: none">
			<router-link to="/">Hello</router-link> | 
			<router-link to="/week">Week</router-link>
		</div>

		<!-- div class="container">
			<div class="g-signin2" data-onsuccess="onSignIn">sign-in</div>
		</div>
		<div><a href="#" onclick="signOut();">Sign out</a></div -->

    <router-view/>
  </div>
</template>

<script>
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}

export default {
  name: 'App'
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

.g-signin2{
  width: 100%;
}

.g-signin2 > div{
  margin: 0 auto;
}
</style>
