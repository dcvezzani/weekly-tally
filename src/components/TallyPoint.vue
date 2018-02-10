<template>
  <div :class="['tally-point']">

		<div class="field">
			<div class="control">
				<label class="checkbox">
					<input v-model="checked" type="checkbox">
				</label>
			</div>
		</div>

  </div>
</template>

<script>
export default {
  name: 'TallyPoint',
  props: {
	},
	computed: {
	},
	methods: {
	},
  data () {
    return {
			selected: false, 
			checked: false, 
			points: 0,
    }
  }, 
	mounted () {
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.tally-point {
		margin: 10px 11px 20px 11px;
	}
	.tally-point input {
		transform: scale(2) !important;
	}
</style>


