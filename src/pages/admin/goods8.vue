<template>
	<goods fromtype="8" :settings="settings"></goods>
</template>

<script type="text/javascript">
    import goods from './goods'
	export default {
	  	components: {
            goods
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