<template>
	<weixindata op="weixindata" :settings="settings"></weixindata>
</template>

<script type="text/javascript">
    import weixindata from '../../components/weixindata'
	export default {
	  	components: {
            weixindata
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