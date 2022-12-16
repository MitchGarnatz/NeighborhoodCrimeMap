<script>
    export default {
        data() {
            return {
                case_number: "",
                date: "",
                time: "",
                code: "",
                incident: "",
                police_grid: "",
                neighborhood_number: "",
                block: ""
            }
        },
        methods: {
            submitForm() {
                let incident_data = {
                    "case_number": parseInt(this.case_number),
                    "date": this.date,
                    "time": this.time,
                    "code": this.code,
                    "incident": this.incident,
                    "police_grid": this.police_grid,
                    "neighborhood_number": this.neighborhood_number,
                    "block": this.block
                }
                this.$emit('submitted', incident_data)           
             }
        }
    }

</script>

<template>
    <div class="grid-container">
        <div class="grid-x grid-padding-x">
            <h1 class="cell 12" style="background-color:aqua;">New Incident Form</h1>



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

            <!--

            

            <form action="">
                <div class="cell 6">
                    <label for="case_no">Case Number</label>
                    <input type="text" placeholder="XXX" name="case_no">
                </div>
                <div class="cell 6">
                    <label for="date">Date</label>
                    <input type="text" placeholder="MM-DD-YYYY" name="date">
                </div>    
                <label for="time">Time</label>
                <input type="text" placeholder="HH:MM" name="time">
                
                <label for="code">SPPD Code</label>
                <input type="text" placeholder="100" name="code">
                <br>
                <label for="incident">Incident</label>
                <input type="text" placeholder="" name="incident">
                
                <label for="police_grid">Police Grid</label>
                <input type="text" placeholder="" name="police_grid">
                <br>
                <label for="neighborhood_number">Neighborhood Number</label>
                <input type="text" placeholder="" name="neighborhoood_number">
                
                <label for="block">Block</label>
                <input type="text" placeholder="" name="block">
                <input type="submit" value="Submit">
            </form>
        -->
        </div>
    </div>
</template>

<style>



</style>