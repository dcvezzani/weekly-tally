<template>
  <div class="container week">
		<div id="days">
			<day label="Su"></day>
			<day label="M"></day>
			<day label="Tu"></day>
			<day label="W"></day>
			<day label="Th"></day>
			<day label="F"></day>
			<day label="Sa"></day>
		</div>

		<div @click="hello" id="canvas">
			<div id="positive-food" class="canvas-section">
				<div class="details"></div>
				<div class="points"></div>
			</div>
			<div id="negative-food" class="canvas-section">
				<div class="details"></div>
				<div class="points"></div>
			</div>
			<div id="water" class="canvas-section">
				<div class="details"></div>
				<div class="points"></div>
			</div>
			<div id="exercise" class="canvas-section">
				<div class="details"></div>
				<div class="points"></div>
			</div>
			<div id="daily-greatness" class="canvas-section">
				<div class="details"></div>
				<div class="points"></div>
			</div>
			<div id="scripture-study" class="canvas-section">
				<div class="details"></div>
				<div class="points"></div>
			</div>
			<div id="personal-prayer" class="canvas-section">
				<div class="details"></div>
				<div class="points"></div>
			</div>
		</div>
  </div>
</template>

<script>
import $ from 'jquery';
import Checkbox from '@/components/Checkbox';
import Day from '@/components/Day';

export default {
  name: 'Week',
	components: {
		"checkbox": Checkbox, 
		"day": Day, 
	}, 
	methods: {
		hello ($event) { 
			console.log("hello"); 
			console.log($($event.target).closest(".canvas-section"))
		}, 
	},
  data () {
    return {
    }
  }, 
	mounted () {
		let daysOfWeek = ['su', 'm', 'tu', 'w', 'th', 'f', 'sa'];
		let topics = ['positive-food-details', 'positive-food', 'negative-food-details', 'negative-food', 'water-details', 'water', 'exercise-details', 'exercise', 'daily-greatness-details', 'daily-greatness', 'scripture-study-details', 'scripture-study', 'personal-prayer-details', 'personal-prayer']

		for (let day of daysOfWeek) {
			for (let topic of topics) {
				console.log($('.' + day + '-' + topic + ' input[type="checkbox"]'));
				//let node = $('.' + day + '-' + topic).detach();
				if (topic.match(/details/)) {
					let topicCategory = topic.split(/-details/)[0];
					//node.appendTo('#' + topicCategory + ' .details');
				} else {
					//node.appendTo('#' + topic + ' .points');
				}
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#canvas {
	}
	#canvas .canvas-section {
		border: 1px solid red;
	}
	#days {
		
	}
</style>
