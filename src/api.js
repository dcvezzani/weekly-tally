import axios from 'axios'
import moment from 'moment'

var instance = axios.create({
	baseURL: 'http://10.0.0.236:3000/api/',
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

	fetchWeek: (date, callback) => {
		// console.log(date);
		const startDate = moment(date).startOf('week').format('YYYY-MM-DD');
		const stopDate = moment(date).endOf('week').format('YYYY-MM-DD');
		// callback({recordedAtStart: startDate, recordedAtStop: stopDate});
		// return;

		const params = {params: {recordedAtStart: startDate, recordedAtStop: stopDate}};
		instance.get('/user/1/week', params)
			.then(function (response) {
				callback(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

	fetchTotal: (date, topic, callback) => {
		// console.log(date);
		const startDate = moment(date).startOf('week').format('YYYY-MM-DD');
		const stopDate = moment(date).endOf('week').format('YYYY-MM-DD');
		// callback({recordedAtStart: startDate, recordedAtStop: stopDate});
		// return;

		const params = {params: {recordedAtStart: startDate, recordedAtStop: stopDate}};
		instance.get('/user/1/week/' + topic + '/total', params)
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

	saveDetails: (data, callback) => {
		// console.log(data);
		let date = data.source.split(/:/)[1];
		let topic = data.source.split(/:/)[2].replace(/-/, '_');
		let body = {}
		body[topic + "_details"] = data.details;
		instance.put('/user/1/week/day/' + date, body)
			.then(function (response) {
				callback(response);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

	saveTopicAccomplished: (data, callback) => {
		// console.log(data);
		let date = data.source.split(/:/)[1];
		let topic = data.source.split(/:/)[2].replace(/-/, '_');
		let body = {}
		body[topic + "_checked"] = data.checked;
		instance.put('/user/1/week/day/' + date, body)
			.then(function (response) {
				callback(response);
			})
			.catch(function (error) {
				console.error(error);
			});
	}, 

};

export default api;
