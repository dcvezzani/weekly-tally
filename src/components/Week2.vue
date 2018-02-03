<template>
  <div class="container week">

		<ul id="days-of-the-week">
			<li v-for="day in daysOfWeek"><a :class="{'button': true, 'is-primary': isSelected(day)}" @click="selectDetails(day)">{{ day }}</a></li>
		</ul>

		<topic label="Positive Food" :dates="datesOfWeek"></topic>
		<topic label="Negative Food" :dates="datesOfWeek"></topic>
		<topic label="Water" :dates="datesOfWeek"></topic>
		<topic label="Exercise" :dates="datesOfWeek"></topic>
		<topic label="Daily Greatness" :dates="datesOfWeek"></topic>
		<topic label="Scripture Study" :dates="datesOfWeek"></topic>
		<topic label="Personal Prayer" :dates="datesOfWeek"></topic>

  </div>
</template>

<script>
import $ from 'jquery';
import moment from 'moment';
import api from '../api';
import Topic from '@/components/Topic'

window.ReadOnly = {
	daysOfWeek: () => { return ['su', 'm', 'tu', 'w', 'th', 'f', 'sa'] },
	topics: () => { return ['positive-food', 'negative-food', 'water', 'exercise', 'daily-greatness', 'scripture-study', 'personal-prayer'] },
}

export default {
  name: 'Week',
	components: {
		"topic": Topic, 
	}, 
	computed: {
		daysOfWeek () { return window.ReadOnly.daysOfWeek(); }, 
		topics () { return window.ReadOnly.topics(); }, 
		datesOfWeek () { 
			let dates = {};
			let start = moment().startOf('week');
			let cnt = 0;
			for (let cnt=0; cnt < 7; cnt += 1) {
				let dateLabel = this.daysOfWeek[cnt];
				let dateValue = start.format("YYYY-MM-DD");
				dates[dateLabel] = dateValue;
				start = start.add(1, 'days');
			}
			return dates;
		}
	},
	methods: {
		selectDetails (day) {
			this.selectedDay = day
			console.log("selecting " + day);
			window.Event.$emit("details:select", this.selectedDay);
			return false;
		},
		isSelected (day) {
			return (this.selectedDay == day);
		},
		allCheckboxesCheckedFor (topic) {
			let isChecked = true;
			for (let idx in this.daysOfWeek) {
				let dow = this.daysOfWeek[idx];
				let date = this.datesOfWeek[dow];
				let checkboxSelector = '.' + dow + '-' + date + '-' + topic + ' input';
				// console.log(checkboxSelector);
				// console.log($(checkboxSelector)[0]);
				// console.log($(checkboxSelector).is(":checked"));
				isChecked = isChecked && $(checkboxSelector).is(":checked")
			}
			return isChecked;
		}, 
		toggleCheckboxes (options) {
			let checkbox = $("." + options.checkboxClassId + " input");
			let checked = checkbox.is(":checked");
			let groupChecked = this.allCheckboxesCheckedFor(options.topic)
			let setChecked = null;

			// console.log("groupChecked: " + groupChecked);
			if (groupChecked) {
				setChecked = false;
			} else if (!groupChecked && checked) {
				setChecked = true;
			} else {
				setChecked = !checked;
			}

			return setChecked;
		},
	},
  data () {
    return {
			label: 'asdf', 
			selectedDay: 'su'
    }
  }, 
	mounted () {
		// let topics = ['positive-food-details', 'positive-food', 'negative-food-details', 'negative-food', 'water-details', 'water', 'exercise-details', 'exercise', 'daily-greatness-details', 'daily-greatness', 'scripture-study-details', 'scripture-study', 'personal-prayer-details', 'personal-prayer']

		// for (let day of this.daysOfWeek) {
		// 	for (let topic of topics) {
		// 		//console.log(day + "-" + topic);
		// 	}
		// }

		window.Event.$on("checkbox:notify", (data) => {
			console.log(data);
		});
		window.Event.$on("details:notify", (data) => {
			api.saveDetails(data, (res) => {
				console.log(res);
			});
		});

		api.fetchWeek(this.datesOfWeek[0], (res) => {
			console.log(res.weeks);
			for (let day of res.weeks) {
				window.Event.$emit("data:update", day)
			}
		});
		

		// {checkboxClassId: this.checkboxClassid, meta: this.meta}
	  window.Event.$on("week:toggle-checkbox-selected", (options) => {
			const topic = options.meta.topic;
			const toggleCheckOptions = Object.assign({}, options, {topic: topic});
			
			window.Event.$emit("checkbox:check", {topic: topic, checked: this.toggleCheckboxes(toggleCheckOptions)});
		});

		this.selectDetails(this.selectedDay);
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#days-of-the-week {
		margin: 2em 0;
	}
	#days-of-the-week li {
		display: inline-block;
		margin: 0 2px;
	}
</style>
