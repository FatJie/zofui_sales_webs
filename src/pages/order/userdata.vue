<template>
	<userdata op="userdata" :settings="settings"></userdata>
</template>

<script type="text/javascript">
    import userdata from '../../components/userdata'
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