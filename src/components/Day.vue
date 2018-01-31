<template>
  <div class="section day">

		<h3>{{ label }}</h3>
		<day-details name="positive-food-details" label="Positive Food"></day-details>
		<checkbox name="positive-food"></checkbox>
		<day-details name="negative-food-details" label="Negative Food"></day-details>
		<checkbox name="negative-food"></checkbox>
		<day-details name="water-details" label="Water"></day-details>
		<checkbox name="water"></checkbox>
		<day-details name="exercise-details" label="Exercise"></day-details>
		<checkbox name="exercise"></checkbox>
		<day-details name="daily-greatness-details" label="Daily Greatness"></day-details>
		<checkbox name="daily-greatness"></checkbox>
		<day-details name="scripture-study-details" label="Scripture Study"></day-details>
		<checkbox name="scripture-study"></checkbox>
		<day-details name="personal-prayer-details" label="Personal Prayer"></day-details>
		<checkbox name="personal-prayer"></checkbox>

  </div>
</template>

<script>
import Checkbox from '@/components/Checkbox'
import Details from '@/components/Details'

export default {
  name: 'Day',
	components: {
		"checkbox": Checkbox, 
		"day-details": Details, 
	}, 
  props: {
		label: {type: String, required: true}
	},
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.checkbox {
		margin: 10px;
	}
	.checkbox input {
		transform: scale(3) !important;
	}
	.day {
		margin-top: 1em;
		border-top: 1px solid silver;
	}
	h3 {
		font-weight: bold;
		font-size: 18pt;
	}
</style>


