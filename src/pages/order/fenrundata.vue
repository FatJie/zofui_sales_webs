<template>
	<fenrundata op="fenrundata" :settings="settings"></fenrundata>
</template>

<script type="text/javascript">
    import fenrundata from '../../components/fenrundata'
	export default {
	  	components: {
            fenrundata
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