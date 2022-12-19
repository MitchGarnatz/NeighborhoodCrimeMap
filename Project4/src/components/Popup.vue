<script>
export default {
    props: ['inc'],
    methods: {
        DeleteInc(event){
            this.$emit('delete',this.inc.case_number);
        }
    }
}
</script>

<template>
    <br>Date:  + {{inc.date}} <br>Time:  {{inc.time}} + <br>Incident:  + {{inc.incident}} + <br>
    <button class="button" @click="DeleteInc(inc.case_number)">DELETE</button>
  
</template>