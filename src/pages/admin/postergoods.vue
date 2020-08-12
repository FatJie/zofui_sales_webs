<template>
    <div>
        <page type="goods" dev="admin" :shopid="shopid" :uniacid="uniacid" :gtype="gtype" :set="settings" op="goods1" ></page>
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
                gtype : '',
                uniacid : '',
                shopid : '',
            }
        },
        created:function(){
            var self = this;
            var params = this.$route.query;
            var gid = params.gid ? params.gid : 0;
            var postdata = {
                p:'admin',
                op : 'poster',
                fromajax : 1,
                id : gid,
            }

            self.$util.http('good','GET',postdata,function(res){
                if( res.status == 200 ){
                    
                    self.gtype = res.obj.gtype;
                    self.shopid = res.obj.shopid;
                    self.uniacid = res.obj.uniacid;
                    
                    self.loading = false;

                }else{
                    self.$Message.error(res.res);
                }
            });

        },

    }
</script>

<style type="text/css" scoped>


</style>