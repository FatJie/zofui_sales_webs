<template>
	<div>
        <payed type="back" :set="settings"></payed>
    </div>
</template>

<script type="text/javascript">
    import payed from '../../pages/money/payed'
	export default {
	  	components: {
            payed
	  	},
        props : ['settings'],
	  	data : function(){
	  		return {
	  		}
	  	},
        created:function(){
            

        },

  	}
</script>

<style type="text/css" scoped>


</style>