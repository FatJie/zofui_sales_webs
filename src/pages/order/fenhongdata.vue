<template>
	<fenhongdata op="fenhongdata" :settings="fenhongdata"></fenhongdata>
</template>

<script type="text/javascript">
    import fenhongdata from '../../components/fenhongdata'
	export default {
	  	components: {
            fenhongdata
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