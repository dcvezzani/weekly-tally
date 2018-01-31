import axios from 'axios'

var instance = axios.create({
	baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

var api = {

	saveDetails: (data, callback) => {
		console.log(data);
		let date = data.source.split(/:/)[1];
		callback({recordedAt: date, asdf: "asdf"});
		return;
		instance.post('/weeks', data)
			.then(function (response) {
				console.log(response);
				callback(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	}, 

};

export default api;
