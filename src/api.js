import axios from 'axios'
import moment from 'moment'
import jwt from 'jsonwebtoken'

var instance = axios.create({
	baseURL: "https://reliacode.com/api/",
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

function adjustExercise (total) {
	let res = {}

	res['exercise-bonus'] = (total >= 120) ? 10 : 0;

	let rest = 0;
	while ((total+rest) < 140 && rest < 40) {
		rest += 20
	}
	res['rest-days'] = rest;
	
	total += rest;
	total += res['exercise-bonus'];
	if (total >= 150) {
		res['exercise-max-hit'] = true;
		total = 150;
	}

	res['total'] = total;
	return res;
}
var api = {

	fetchUser: (token, callback) => {
    var user = jwt.decode(token);
    // console.log(['chk2', user, token]);

		instance.get('/user/' + user.id)
			.then(function (response) {
				callback(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

	updateUser: (token, data, callback) => {
    var user = jwt.decode(token);
    // console.log(['chk2', user, token]);
		// let body = {}
		// body[topic + "_details"] = data.details;

		instance.put('/user/' + user.id, data)
			.then(function (response) {
				callback(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

	fetchWeek: (token, date, callback) => {
		// console.log(date);
		const startDate = moment(date).startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
		const stopDate = moment(date).endOf('week').subtract(1, 'days').format('YYYY-MM-DD');
		// callback({recordedAtStart: startDate, recordedAtStop: stopDate});
		// return;

    var user = jwt.decode(token);
    // console.log(['chk', user, token]);
		const params = {params: {recordedAtStart: startDate, recordedAtStop: stopDate}};
		instance.get('/user/' + user.id + '/week', params)
			.then(function (response) {
				callback(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

	fetchTotal: (token, date, topic, callback) => {
		// console.log(date);
		const startDate = moment(date).startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
		const stopDate = moment(date).endOf('week').subtract(1, 'days').format('YYYY-MM-DD');
		// callback({recordedAtStart: startDate, recordedAtStop: stopDate});
		// return;

    var user = jwt.decode(token);
		const params = {params: {recordedAtStart: startDate, recordedAtStop: stopDate}};
		instance.get('/user/' + user.id + '/week/' + topic + '/total', params)
			.then(function (response) {
				console.log([response.data, topic]);

				let data = response.data;
				switch (data.topic) {
					case 'all':
						let exercise = adjustExercise(data.exercise_total);
						// console.log(["exercise", data.total, exercise.total]);
						data.total += exercise.total;
						//console.log(["exercise (2)", exercise, data]);
						break;
					case 'exercise':
						data = Object.assign(data, adjustExercise(data.total));
						break;
				}
				callback(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

	saveDetails: (token, data, callback) => {
		// console.log(data);
		let date = data.source.split(/:/)[1];
		let topic = data.source.split(/:/)[2].replace(/-/, '_');

    var user = jwt.decode(token);
		let body = {}
		body[topic + "_details"] = data.details;
		instance.put('/user/' + user.id + '/week/day/' + date, body)
			.then(function (response) {
				callback(response);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

	saveTopicAccomplished: (token, data, callback) => {
		// console.log(data);
		let date = data.source.split(/:/)[1];
		let topic = data.source.split(/:/)[2].replace(/-/, '_');

    var user = jwt.decode(token);
		let body = {}
		body[topic + "_checked"] = data.checked;
		instance.put('/user/' + user.id + '/week/day/' + date, body)
			.then(function (response) {
				callback(response);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

};

export default api;
