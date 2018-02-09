<template>
  <div :class="['day-details', nid]" :ref="nid" v-if="selected">

		<div class="field">
			<label class="label" @click="toggleAllCheckboxes">{{ label }} ({{ dayOfWeek }})</label>
			<div class="control">
				<textarea @blur="notify" v-model="details" class="textarea" placeholder="Textarea"></textarea>
			</div>
		</div>

  </div>
</template>

<script>
import $ from 'jquery';
import moment from 'moment';

export default {
  name: 'Details',
  props: {
		name: {type: String, required: true}, 
		label: {type: String, required: true}
	},
	computed: {
		daysOfWeek () { return window.ReadOnly.daysOfWeek(); }, 
		nid () {
			return this.name;
		}, 
		meta () {
			let metadata = {}
			let keys = ['day', 'date', 'topic', 'subtopic'];
			let parts = this.name.split(/:/);
			for (let idx in keys) {
				metadata[keys[idx]] = parts[idx];
			}
			return metadata;
		}, 
		day () {
			return this.meta.day;
		},
		dayOfWeek () {
			return moment(this.meta.date).format("dddd");
		},
		date () {
			return this.meta.date;
		},
		topic () {
			return this.meta.topic;
		},
		dbTopic () {
			return this.meta.topic.replace(/-/, '_');
		},
		subtopic () {
			return this.meta.subtopic;
		},
		data () {
			let props = {source: this.name}
			for (let prop of ['details']) {
				props[prop] = this[prop];
			}
			return props;
		}, 
		checkboxClassid () {
			return this.name.replace(/:details$/, '').replace(/:/g, '-');
		},

	},
	methods: {
		notify () {
		  window.Event.$emit("details:notify", this.data);
		}, 
		dbFieldFor (subtopic) {
			return this.dbTopic + "_" + subtopic.replace(/-/, '_');
		}, 
		toggleAllCheckboxes () {
		  window.Event.$emit("week:toggle-checkbox-selected", {checkboxClassId: this.checkboxClassid, meta: this.meta});
		},
	},
  data () {
    return {
			selected: false, 
			details: '', 
			dayId: null, 
    }
  }, 
	mounted () {
		window.Event.$on("details:select", (day) => {
			this.selected = (day == this.day);
		});
	  window.Event.$on("data:clear", (data, options) => {
      this.details = '';
		});
	  window.Event.$on("data:update", (data, options) => {
			if (data.recorded_on == this.date) {
				this.details = data[this.dbFieldFor('details')];
				this.dayId = data.id;
				//console.log(["data:update", data])
			}
		});
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field {
	margin: 0 2em;
}
</style>


