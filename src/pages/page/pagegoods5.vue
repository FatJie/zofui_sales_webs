<template>
    <div>
        <page type="goods" gtype="5" :set="settings" op="goods5" ptype="pagegoods5"></page>
    </div>
</template>

<script type="text/javascript">
    import page from '../../pages/page/pagegoods0'
    export default {
        components: {
            page
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