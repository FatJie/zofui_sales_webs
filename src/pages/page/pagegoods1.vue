<template>
    <div>
        <page type="goods" gtype="1" :set="settings" op="goods1" ptype="pagegoods1"></page>
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