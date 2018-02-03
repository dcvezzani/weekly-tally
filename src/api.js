import axios from 'axios'
import moment from 'moment'

var instance = axios.create({
	baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

var api = {

	fetchWeek: (date, callback) => {
		console.log(date);
		const startDate = moment(date).startOf('week').format('YYYY-MM-DD');
		const stopDate = moment(date).endOf('week').format('YYYY-MM-DD');
		// callback({recordedAtStart: startDate, recordedAtStop: stopDate});
		// return;

		const params = {params: {recordedAtStart: startDate, recordedAtStop: stopDate}};
		instance.get('/weeks', params)
			.then(function (response) {
				callback(response.data);
			})
			.catch(function (error) {
				console.log(error);
			});
	}, 

	saveDetails: (data, callback) => {
		console.log(data);
		let date = data.source.split(/:/)[1];
		let topic = data.source.split(/:/)[2].replace(/-/, '_');
		let body = {}
		body[topic + "_details"] = data.details;
		instance.put('/weeks/' + date, body)
			.then(function (response) {
				callback(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	}, 

};

export default api;
