<template>
	<shanghudata op="shanghudata" :settings="settings"></shanghudata>
</template>

<script type="text/javascript">
    import shanghudata from '../../components/shanghudata'
	export default {
	  	components: {
            shanghudata
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