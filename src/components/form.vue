<template>
    <div>

        <div class="mb20">
            <Dropdown @on-click="addform">
                <Button type="primary">
                    添加元素
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="text">文字</DropdownItem>
                    <DropdownItem name="num">数字</DropdownItem>
                    <DropdownItem name="single">选择一个</DropdownItem>
                    <DropdownItem name="multi">选择多个</DropdownItem>
                    <DropdownItem name="date">选择日期</DropdownItem>
                    <DropdownItem name="time">选择时间</DropdownItem>
                    <DropdownItem name="region">选择地区</DropdownItem>
                    <DropdownItem name="tel">电话号码</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div>
            <Card v-for="(item,index) in form" class="mb10" style="position:relative;">
                <Icon type="ios-trash" size="20" @click="delform(index)" style="position:absolute;right:0;top:0;cursor: pointer;" />

                <Row class="" type="flex" align="middle">
                    <Col span="3" class="frm_title">
                        {{item.type == 'text' ? '文字' : ''}}
                        {{item.type == 'num' ? '数字' : ''}}
                        {{item.type == 'single' ? '多选一个' : ''}}
                        {{item.type == 'multi' ? '多选多个' : ''}}
                        {{item.type == 'date' ? '选择日期' : ''}}
                        {{item.type == 'time' ? '选择时间' : ''}}
                        {{item.type == 'region' ? '选择地区' : ''}}
                        {{item.type == 'tel' ? '电话号码' : ''}}
                    </Col>
                    <Col span="18" class="frm_content">
                        名称<Input v-model="item.name" type="text" class="w200"  placeholder="输入名称" />，
                        提示文字<Input v-model="item.pla" type="text" class="w200"  placeholder="输入提示内容" />

                        <div class="mt10" v-if="item.type == 'single' || item.type == 'multi'" >
                            <Row class="frm_group" >
                                <Col span="4" class="frm_title">
                                    <Dropdown  placement="bottom" trigger="click">
                                        <a href="javascript:void(0)">
                                            添加选项<Icon type="ios-arrow-down"></Icon>
                                        </a>
                                        <DropdownMenu slot="list">
                                            <div style="padding:10px">
                                                <Input v-model="provalue" placeholder="选项内容" class="w200" />
                                            </div>

                                            <div style="text-align: right;margin:10px;">
                                                <Button type="primary" size="small" @click="addformpro(index)">确定</Button>
                                            </div>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                                <Col span="18" class="frm_content">
                                    <Button size="small" v-for="(inn,idx) in item.sdata" @click="delsdata(index,idx)" class="mr10 mb10" style="margin-bottom:10px;">{{inn}}</Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

            </Card>
        </div> 

    </div>
</template>

<script type="text/javascript">
	export default {
        props : ['type','form','uniacid'],
	    data : function(){
            return {
                loaded : false,
                params : {},
                isshow : false,
                action : '',
                total : 0,
                pageurl : '',
                list : [],
                provalue : '',
            }
        },
        watch : {
            form(val){
                this.$emit('setform', val);
            },
        },
        methods : {
            addformpro(e){
                if( !this.provalue ) return false;

                if( !this.form[e].sdata ){
                    this.$set(this.form[e],'sdata',[]);
                }
                this.form[e].sdata.push(this.provalue);
                this.provalue = '';
            },
            addform(e){
                var id = 'i' + new Date().getTime();
                this.form.push({
                    id : id,
                    type : e,
                });
            },
            delform(e){
                this.form.splice(e,1);
            },
            delsdata(i,d){
                this.form[i].sdata.splice(d,1);
            },
            ectimg(e){
                this.$emit('uploadmethod', e);
                this.isshow = false;
                this.$Message.success('已选择图片');
            },
            showbox(){
                this.isshow = true;
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            initData(){
                var self = this;
                self.$util.pageList(this,this.page,function(res){    
                    if( res.status == 200 ){
                        self.list = res.obj.list ? res.obj.list : [];
                        self.total = res.obj.total;
                    }
                })
            },
            onLoad() {
                var self = this;
                if( self.page.doing ){
                    return false;
                }
                self.loading = true;
                self.$util.pageList(this,this.page,function(res){
                    if( res && res.obj ){
                        self.list = res.obj.list;
						self.total = res.obj.total;
                    }
                    self.loading = false;
                });
            },
        }
	}
</script>

<style type="text/css">


</style>