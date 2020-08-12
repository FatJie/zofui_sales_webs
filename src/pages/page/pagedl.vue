<template>
    <div>
        <page type="agent" gtype="0" :set="settings" op="agent" ptype="pagedl"></page>
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