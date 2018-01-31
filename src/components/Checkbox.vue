<template>
  <div :class="['checkbox', classid]">

		<div class="field">
			<div class="control">
				<label class="checkbox">
					<input @click="notify" v-model="checked" type="checkbox">
				</label>
			</div>
		</div>

  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
		name: {type: String, required: true}
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
			let parts = this.name.split(/:/);
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
		notify () {
		  this.$nextTick(() => {window.Event.$emit("checkbox:notify", this.data);});
		}
	},
  data () {
    return {
			checked: false
    }
  }, 
	mounted () {
	  window.Event.$on("checkbox:check", (options) => {
			if (this.topic == options.topic) {
				this.checked = options.checked;
			}
		});
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.checkbox {
		margin: 10px 7px 20px 7px;
	}
	.checkbox input {
		transform: scale(2) !important;
	}
</style>

