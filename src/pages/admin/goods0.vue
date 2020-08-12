<template>
	<goods fromtype="100" :settings="settings"></goods>
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
        	document.title = '普通'+this.settings.goodbname;
        },
	  	methods: {
            
	  	}
  	}
</script>

<style type="text/css" scoped>


</style>