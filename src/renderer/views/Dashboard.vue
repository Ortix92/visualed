<template>
    <v-layout row wrap justify-center id="wrapper">
        <v-flex xs10 class="mt-4">
            <v-card>
                <v-card-title class="headline">Configuration</v-card-title>
                <v-divider></v-divider>
                <v-card-actions class="pt-3 pb-3">
                    <v-spacer></v-spacer>
                    <v-slider v-model="maxLeds" thumb-label></v-slider>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import Visualed from '../../../local_modules/visualed.js'
let leds = new Visualed
leds.rainbowSweep()
leds.run()

export default {
  name: 'dashboard',
  data () {
    return {
      maxLeds: 50
    }
  }
}
</script>

<style>

</style>
