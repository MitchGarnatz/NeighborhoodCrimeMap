<script>
    export default {
        return: {
            case_number: 0
        }
    }

</script>

<template>
    <div class="grid-container">
        <div class="grid-x grid-padding-x">
            <h1 class="cell 12">New Incident Form</h1>

            <!--<input v-model="case_number" placeholder="case number" />-->


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
        </div>
    </div>
</template>

<style>

</style>