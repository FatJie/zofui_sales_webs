<template>
	<freezedata op="freezedata" :settings="fenhongdata"></freezedata>
</template>

<script type="text/javascript">
    import freezedata from '../../components/freezedata'
	export default {
	  	components: {
            freezedata
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