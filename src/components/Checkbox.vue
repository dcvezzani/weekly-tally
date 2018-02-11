<template>
  <div :class="['checkbox', classid]" v-if="selected || weekView">

    <!-- div class="tally-points" v-if="loaded && !weekView">
      <tally-point v-for="tally in tallyPoints" :key="tally.id"></tally-point>
    </div -->

		<div class="field">
			<div class="control">
				<label class="checkbox">
          <div class="checkbox-label" v-if="weekView">{{ day }}</div>
					<input @click="notify" v-model="checked" type="checkbox">
				</label>
			</div>
		</div>

  </div>
</template>

<script>
import TallyPoint from '@/components/TallyPoint';

export default {
  name: 'Checkbox',
  props: {
		name: {type: String, required: true}, 
		daySlot: {type: String, required: true}, 
		tallyCnt: {type: Number}, 
	},
	components: {
		"tally-point": TallyPoint, 
	}, 
	computed: {
		nid () {
			return this.$parent.label.toLowerCase() + "-" + this.name;
		}, 
		classid () {
			return this.name.replace(/:/g, '-');
		}, 
		meta () {
			let metadata = {}
			let keys = ['day', 'date', 'topic', 'subtopic'];
      // console.log(['this.name', this.name]);
			let parts = ((this.dayMeta) ? this.dayMeta : this.name).split(/:/);
			for (let idx in keys) {
				metadata[keys[idx]] = parts[idx];
			}
			return metadata;
		}, 
		day () {
			return this.meta.day;
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
			for (let prop of ['checked']) {
				props[prop] = this[prop];
			}
			return props;
		}
	},
	methods: {
		hello () {
		  console.log("hello from: " + this.nid);
		}, 
		dbFieldFor (subtopic) {
			return this.dbTopic + "_" + subtopic.replace(/-/, '_');
		}, 
		notify () {
		  this.$nextTick(() => {window.Event.$emit("checkbox:notify", this.data);});
		}
	},
  data () {
    return {
			dayMeta: null, 
			selected: false, 
			checked: false, 
			points: 0,
			dayId: null, 
      weekView: false, 
      tallyPoints: [
        {id: 1}, 
        {id: 2}, 
        {id: 3}, 
        {id: 4}, 
        {id: 5}, 
        {id: 6}, 
        {id: 7}, 
        {id: 8}, 
        {id: 9}, 
        {id: 10}, 
      ],
      loaded: false, 
    }
  }, 
	mounted () {
	  window.Event.$on("dayMeta:set", (daySlot, topic, data) => {
      if (daySlot == this.daySlot && topic == this.topic) {
        this.dayMeta = data;
      }
		});
	  window.Event.$on("dayMeta:clear", () => {
      this.dayMeta = null;
		});

		window.Event.$on("checkbox:fetch-topic-complete", (options) => {
			if (this.topic == options.topic) {
        window.Event.$emit(options.emit, {topic: this.topic, checked: this.checked});
      }
		});

		window.Event.$on("week-view:enable", (mode) => {
			this.weekView = (mode == true);
		});

		window.Event.$on("details:select", (day) => {
			this.selected = (day == this.day);
		});
    
	  window.Event.$on("checkbox:check", (options) => {
			if (this.topic == options.topic) {
				this.checked = options.checked;
				this.notify();
			}
		});
	  window.Event.$on("data:clear", (data, options) => {
      this.checked = false;
      this.points = 0;
		});
	  window.Event.$on("data:update", (data, options) => {
      // console.log(['data:update', data.recorded_on, this.date, data]);
			if (data.recorded_on == this.date) {
				this.points = data[this.dbFieldFor('points')];
				this.checked = ((typeof this.points !== 'undefined') && this.points != null && this.points != 0);
				this.dayId = data.id;
				window.Event.$emit("data:updated", {date: this.date, topic: this.topic});
			}
		});

    this.tallyPoints.length = 0;
    for (let i=0; i<this.tallyCnt; i++) {
      this.tallyPoints.push ({id: i})
    }

    this.loaded = true;
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.checkbox {
		margin: 10px 7px 20px 7px;
    text-align: center;
    display: inherit;
	}
	.checkbox input {
		transform: scale(2) !important;
	}

  .tally-points div {
    display: inline-block;
  }

  .checkbox-label {
    margin-bottom: 0.5em;
  }
</style>

