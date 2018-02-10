<template>
  <div :class="['topic', nid]" :ref="nid">

    <div v-if="weekView">
      <div>{{ total }}</div>
      <div class="field">
        <label class="label" @click="toggleAllCheckboxes">{{ label }}<span v-if="!weekView"> ({{ dayOfWeek }})</span></label>
      </div>
    </div>
		<ul>
			<li v-for="day in daysOfWeek"><day-details :name="topicDetails(day)" :label="label"></day-details></li>
		</ul>

		<ul class="points">
			<li v-for="day in daysOfWeek"><checkbox :name="topicPoints(day)"></checkbox></li>
		</ul>

  </div>
</template>

<script>
import Details from '@/components/Details'
import Checkbox from '@/components/Checkbox';

export default {
  name: 'Topic',
  props: {
		name: {type: String}, 
		dates: {type: Object}, 
		label: {type: String, required: true}
	},
	components: {
		"day-details": Details, 
		"checkbox": Checkbox, 
	}, 
	computed: {
		daysOfWeek () { return this.$parent.daysOfWeek; }, 
		datesOfWeek () { 
			let dates = [];
			for (let date in this.dates) {
				dates.push (this.dates[date]);
			}
			return dates;
		}, 
		nid () {
			return this.$parent.label.toLowerCase() + "-" + this.topicLabel;
		},
		topicLabel () {
			return this.label.toLowerCase().replace(/ +/, '-');
		},
	},
	methods: {
		toggleAllCheckboxes () {
      if (this.weekView) {
        window.Event.$emit("week2:toggle-checkbox-selected", {topic: this.topicLabel});
      }
		},
		topicPrefix (day) {
			return day + ":" + this.dates[day] + ":";
		}, 
		topicDetails (day) {
			return this.topicPrefix(day) + this.topicLabel + ":details";
		}, 
		topicPoints (day) {
			return this.topicPrefix(day) + this.topicLabel;
		}
	},
  data () {
    return {
			total: 0, 
      weekView: false, 
    }
  }, 
	mounted () {
		window.Event.$on("week-view:enable", (mode) => {
			this.weekView = (mode == true);
		});
		// {topic: topic, total: res.total}
		window.Event.$on("topic:points:update", (data) => {
			// console.log(['topic:points:update', data, this.topicLabel, data.topic, data.total]);
			if (this.topicLabel == data.topic) {
				this.total = data.total;
				window.Event.$emit("topic:points:updated");
			}
		});
	  window.Event.$on("data:clear", (data, options) => {
      this.total = 0;
		});
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field {
	margin: 0 2em;
}
ul.points li {
	display: inline-block; 
}
</style>



