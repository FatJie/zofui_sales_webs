<template>
    <ordera type="waitpay" :settings="settings"></ordera>
</template>

<script type="text/javascript">
    import ordera from './wait'
    export default {
        components: {
            ordera
        },
        props : ['settings'],
        data : function(){
            return {
                loading : false,
            }
        },
        created:function(){

        },
        methods: {
            
        }
    }
</script>

<style type="text/css" scoped>


</style>