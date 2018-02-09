<template>
  <div class="container week">

    <div id="token" v-show="given_name()">Hello, {{ given_name() }}</div>

    <a class="action" href="#" @click="signOut" v-if="token">(Sign out)</a>

      <hr>

    <div id="personal-data" v-show="token">
      <ul id="days-of-the-week">
        <li v-for="day in daysOfWeek"><a :class="{'button': true, 'is-primary': isSelected(day)}" @click="selectDetails(day)">{{ day }}</a></li>
      </ul>
      
      <hr>

      <div @click="updateTotalPoints">Total Points for the Week: <br>{{ total }}</div>

      <hr>

      <topic label="Positive Food" :dates="datesOfWeek"></topic>
      <topic label="Fruits Vegetables" :dates="datesOfWeek"></topic>
      <topic label="Negative Food" :dates="datesOfWeek"></topic>
      <topic label="Water" :dates="datesOfWeek"></topic>
      <topic label="After 8" :dates="datesOfWeek"></topic>
      <topic label="Exercise" :dates="datesOfWeek"></topic>
      <topic label="Daily Greatness" :dates="datesOfWeek"></topic>
      <topic label="Scripture Study" :dates="datesOfWeek"></topic>
      <topic label="Personal Prayer" :dates="datesOfWeek"></topic>

      <hr>

      <div @click="updateTotalPoints">Total Points for the Week: <br>{{ total }}</div>

      <hr>

      <div class="section">
      <div class="field">
        <label class="label">Lowest Weight</label>
        <div class="control">
          <input ref="lowestWeight" class="input" type="text" placeholder="Lowest weight">
        </div>
        <p class="help">Saturday's scale session</p>
      </div>
      <div class="field">
        <label class="label">Current Weight</label>
        <div class="control">
          <input ref="currentWeight" class="input" type="text" placeholder="Current weight">
        </div>
        <p class="help">Saturday's scale session</p>
      </div>
      <div class="field">
        <p class="control">
          <button @click="calculateWeight" class="button is-success">
            Calculate
          </button>
        </p>
      </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery';
import moment from 'moment';
import api from '../api';
import Topic from '@/components/Topic'
import jwt from 'jsonwebtoken';

window.ReadOnly = {
	daysOfWeek: () => { return ['su', 'm', 'tu', 'w', 'th', 'f', 'sa'] },
	topics: () => { return ['positive-food', 'fruits-vegetables', 'negative-food', 'water', 'after-8', 'exercise', 'daily-greatness', 'scripture-study', 'personal-prayer'] },
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
		}, 
	},
	methods: {
    email () {
      return (this.token) ? jwt.decode(this.token).email : null;
    },
    given_name () {
      return (this.token) ? jwt.decode(this.token).given_name : null;
    },
    signOut () {
			window.Event.$emit("app:signOut");
    },
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
		updateTotalPoints () {
			api.fetchTotal(this.token, this.datesOfWeek[0], 'all', (res) => {
				this.total = res.total;
			});
		},
		calculateWeight () {
			let lowestWeight = parseFloat(this.$refs.lowestWeight.value)
			let currentWeight = parseFloat(this.$refs.currentWeight.value)
			let diffWeight = (lowestWeight - currentWeight)

			if (diffWeight > 0) {
				this.weight_points = (diffWeight / this.weight_factor) * 10;
			} else {
				this.weight_points = 0;
			}
			window.Event.$emit("points:update");
		},
	},
  data () {
    return {
			label: 'asdf', 
			selectedDay: 'su', 
			total: 0,
			topic_points_to_update: 0,
			weight_points: 0,
			weight_factor: 2.0, 
			weight_least: 0, 
      token: null,
    }
  }, 
	mounted () {
		window.Event.$on("checkbox:notify", (data) => {
			api.saveTopicAccomplished(this.token, data, (res) => {
				console.log(res);
				window.Event.$emit("points:update");
			});
		});
		window.Event.$on("details:notify", (data) => {
			api.saveDetails(this.token, data, (res) => {
				// console.log(res);
			});
		});
		window.Event.$on("points:update", (options) => {
			for (let topic of ['positive-food', 'fruits-vegetables', 'negative-food', 'water', 'after-8', 'exercise', 'daily-greatness', 'scripture-study', 'personal-prayer']) {
				// console.log(["points:update", this.datesOfWeek]);
				this.topic_points_to_update = Object.keys(this.datesOfWeek).length;
				api.fetchTotal(this.token, this.datesOfWeek[0], topic, (res) => {
					// console.log({topic: topic, total: res.total});
					window.Event.$emit("topic:points:update", {topic: topic, total: res.total});
				});
			}
		});

		window.Event.$on("topic:points:updated", () => {
			this.topic_points_to_update -= 1;
			// console.log(['topic:points:updated', this.topic_points_to_update]);
			if (this.topic_points_to_update == 0) {
				api.fetchTotal(this.token, this.datesOfWeek[0], 'all', (res) => {
					this.total = res.total + this.weight_points;
				});
			}
		});

		// {date: this.date, topic: this.topic}
		window.Event.$on("data:updated", (data) => {
			// console.log(["data:updated", data]);
		});

		// {checkboxClassId: this.checkboxClassid, meta: this.meta}
	  window.Event.$on("week:toggle-checkbox-selected", (options) => {
			const topic = options.meta.topic;
			const toggleCheckOptions = Object.assign({}, options, {topic: topic});
			
			window.Event.$emit("checkbox:check", {topic: topic, checked: this.toggleCheckboxes(toggleCheckOptions)});
		});

	  window.Event.$on("data:clear", (data, options) => {
      this.total = 0;
		});

    // window.Event.$emit("app:fetchJwt");
    window.Event.$on("week2:fetchedJwt", (token) => {
      // console.log(["week2:fetchedJwt", token]);
      this.token = token;

      if (this.token) {
        api.fetchWeek(this.token, this.datesOfWeek[0], (res) => {
          // console.log(res.week);
          for (let day of res.week) {
            window.Event.$emit("data:update", day)
          }
          window.Event.$emit("points:update");
        });
      } else {
         window.Event.$emit("data:clear");
        // TODO: clear fields
      }

      console.log(['this.selectedDay', this.selectedDay]);
      this.selectDetails(this.selectedDay);
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
  #personal-data {
    margin-top: 2em; 
  }
  .action {
    font-size: smaller;
  }
</style>
