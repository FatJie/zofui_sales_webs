<template>
	<order op="userdata" :settings="settings"></order>
</template>

<script type="text/javascript">
    import order from '../../components/userdata'
	export default {
	  	components: {
            userdata
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