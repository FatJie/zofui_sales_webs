<template>
	<zhifudata op="zhifudata" :settings="settings"></zhifudata>
</template>

<script type="text/javascript">
    import zhifudata from '../../components/zhifudata'
	export default {
	  	components: {
            zhifudata
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