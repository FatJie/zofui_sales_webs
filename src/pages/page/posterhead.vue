<template>
    <Tabs :value="type" @on-click="changetab">
        <TabPane label="商品海报" name="pagegoods0" ></TabPane>
        <TabPane label="限抢海报" name="pagegoods1" ></TabPane>
        <TabPane label="拼团海报" name="pagegoods2" ></TabPane>
        <TabPane label="砍价海报" name="pagegoods3" ></TabPane>
        <TabPane label="报名海报" name="pagegoods4" ></TabPane>
        <TabPane label="抽奖海报" name="pagegoods5" ></TabPane>
        <TabPane label="秒杀海报" name="pagegoods6" ></TabPane>
        <TabPane label="分销海报" name="pagefx" ></TabPane>
        <TabPane label="代理海报" name="pagedl" ></TabPane>
        <TabPane label="店铺海报" name="pageshop" ></TabPane>
        <TabPane label="集字海报" name="pagejizi" ></TabPane>
        <TabPane label="卡券海报" name="pagecard" ></TabPane>
    </Tabs>
</template>

<script type="text/javascript">
    export default {
        components: {},
        props : ['type'],
        data : function(){
            return {
            }
        },
        created:function(){
            

        },
        methods: {
            changetab(e){
                this.$router.push(e);
            },
        }
    }
</script>

<style type="text/css" scoped>


</style>