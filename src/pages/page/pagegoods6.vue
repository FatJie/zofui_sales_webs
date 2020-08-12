<template>
    <div>
        <page type="goods" gtype="6" :set="settings" op="goods6" ptype="pagegoods6"></page>
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