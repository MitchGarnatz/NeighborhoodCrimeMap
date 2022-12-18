<script>
    export default {
        data() {
            return {
                case_number: "",
                date: "",
                time: "",
                code: null,
                incident: "",
                police_grid: null,
                neighborhood_number: null,
                block: "",
                formSubmitted: false,
                failed: false
            }
        },
        methods: {
            submitForm() {
                let incident_data = {
                    "case_number": parseInt(this.case_number),
                    "date": this.date,
                    "time": this.time,
                    "code": parseInt(this.code),
                    "incident": this.incident,
                    "police_grid": parseInt(this.police_grid),
                    "neighborhood_number": parseInt(this.neighborhood_number),
                    "block": this.block
                };
                if(this.validate(incident_data)) {
                    this.$emit('submitted', incident_data)           
                };
             },

             validate(data) {
                for(var key in data) {
                    console.log('key: ',key)
                    if(data[key]===""||data[key]===null) {
                        
                        this.failed = true;
                        return false;
                    }
                }
                return true;
             }
        }
    }

</script>

<template>
    <div class="grid-container">
        <div class="grid-x grid-padding-x">
            <h1 class="cell 12" style="background-color:aqua;">New Incident Form</h1>
            <h4 class="cell 12" v-if="this.failed">Incomplete form! Please ensure that all fields are filled out and submit again.</h4>



            <div class="cell small-12">
                <form @submit.prevent="submitForm" v-if="!formSubmitted">
                    <span>Case Number:</span>
                    <input type="text" id="case_number" v-model="case_number" placeholder="case number" />
                    <br>
                    <span>Date:</span>
                    <input type="text" id="date" v-model="date" placeholder="date" />
                    <br>
                    <span>Time:</span>
                    <input type="text" id="time" v-model="time" placeholder="time" />
                    <br>
                    <span>Code:</span>
                    <input type="text" id="code" v-model="code" placeholder="code" />
                    <br>
                    <span>Incident:</span>
                    <input type="text" id="incident" v-model="incident" placeholder="incident" />
                    <br>
                    <span>Police Grid:</span>
                    <input type="text" id="police_grid" v-model="police_grid" placeholder="police grid" />
                    <br>
                    <span>Neighborhood Number:</span>
                    <input type="text" id="neighborhood_number" v-model="neighborhood_number" placeholder="neighborhood number" />
                    <br>
                    <span>Block</span>
                    <input type="text" id="block" v-model="block" placeholder="block" />
                    <br>
                    <input class="submit" type="submit" value="Submit">
                </form>
            </div>
        </div>
    </div>
</template>

<style>



</style>