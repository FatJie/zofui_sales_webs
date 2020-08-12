<template>
	<div>

        <Tabs value="paklist" @on-click="changetab">
            <TabPane label="套餐列表" name="paklist" ></TabPane>
            <TabPane label="添加套餐" name="pakadd" ></TabPane>
        </Tabs>
        <goods op="pak" :set="settings"></goods>

    </div>
</template>

<script type="text/javascript">
    import goods from '../../pages/goods/list'
	export default {
	  	components: {
            goods
	  	},
        props : ['settings'],
        methods: {
            changetab(e){
                this.$router.push(e);
            },
        }
  	}
</script>

<style type="text/css" scoped>


</style>