<template>
    <div>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                接收对象:
            </Col>
            <Col span="18">
                <Select @on-change="selectType($event)" placeholder="选择会员类型" style="width:400px">
                    <Option v-for="item in ucardtype" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                </Select>
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                选择模板:
            </Col>
            <Col span="18">
                <Select @on-change="selectTem($event)" placeholder="选择模板类型" style="width:400px">
                    <Option v-for="item in templates" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                </Select>
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                输入ID:
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="uid" placeholder="输入用户ID" class="w400"  />
                <p>多个用户ID以逗号隔开</p>
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                标题：
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="title" placeholder="" class="w400"  />
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                活动名称：
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="actname" placeholder="" class="w400"  />
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                开始时间：
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="start" placeholder="" class="w400"  />
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                结束时间：
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="end" placeholder="" class="w400"  />
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                报名价格：
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="price" placeholder="" class="w400"  />
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                选择类型：
            </Col>
            <Col span="18" class="frm_content">
                <RadioGroup v-model="links">
                    <Radio label="0">商品详情</Radio>
                    <Radio label="1">推文</Radio>
                </RadioGroup>
                <p><Input v-model="url" placeholder="" class="w400"  /></p>
                <p>商品详情务必请输入ID，推文务必请输入链接</p>
            </Col>
        </Row>
        <Row class="frm_group">
            <Col span="1" class="frm_title">
                备注内容：
            </Col>
            <Col span="18" class="frm_content">
                <Input v-model="note" type="textarea" :rows="4" class="w400"  placeholder="输入备注内容" />
            </Col>
        </Row> 
        <br>
        <Button type="primary" @click="submit">提交</Button>
    </div>
</template>

<script type="text/javascript">
    export default{
        data(){
            return{
                links:'',
                ucardtype : [
                    {label:'普通会员',value:0},
                    {label:'VIP',value:1},
                    {label:'服务商',value:2},
                    {label:'代理商',value:3}
                ],
                templates: [
                    {label:'模板一',value:0},
                    {label:'模板二',value:1},
                    {label:'模板三',value:2}
                ],
                templatesValue:'',
                uid:'',
                title:'',
                actname:'',
                start:'',
                end:'',
                price:'',
                note:'',
                url:'',
                type:''
            }
        },
        methods:{
            selectType(e){
                this.type = e;
            },
            selectTem(e){
                this.templatesValue = e;
            },
            submit(){
                var postdata={
                    op:'pushinfo',
                    title:this.title,
                    url:this.url,
                    actname:this.actname,
                    start:this.start,
                    end:this.end,
                    price:this.price,
                    note:this.note,
                    uid:this.uid,
                    type:this.type,
                    templates:this.templatesValue,
                    links:this.links
                }
                this.$util.http('ajax','POST',postdata,(res)=>{
                    if(res.status==200){
                        this.$Message.success(res.res);
                    }else{
                        this.$Message.success(res.res);
                    }
                })
            }
        }
    }
</script>