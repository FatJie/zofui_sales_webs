<template>
	
    <comment :type="1" :set="settings"></comment>
</template>

<script type="text/javascript">
    import comment from '../../pages/order/comment'
	export default {
	  	components: {
            comment
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
                loading : false,
	  		}
	  	},
        created:function(){
            

        },
  	}
</script>

<style type="text/css" scoped>


</style>