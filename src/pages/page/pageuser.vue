<template>
    <div>
        <page type="user" :settings="settings" ></page>
    </div>
</template>

<script type="text/javascript">
    import page from '../../pages/page/pageindex'
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