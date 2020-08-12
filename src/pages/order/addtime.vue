<template>
	<order op="addtime" :settings="settings"></order>
</template>

<script type="text/javascript">
    import order from '../../components/order'
	export default {
	  	components: {
            order
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