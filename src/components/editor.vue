<template>
    <div>
        
        <vue-ueditor-wrap v-model="html" :config="editerConfig" @beforeInit="addCustomButtom" ></vue-ueditor-wrap>

        <upload ref="uploadref" :type="type" :sid="shopid" :uniacid="uniacid" @uploadmethod="uploadmethod"></upload>
    </div>
    

</template>

<script type="text/javascript">
    import VueUeditorWrap from 'vue-ueditor-wrap'
    import upload from './upload';
	export default {
        props: ['editorhtml','fnname','type','shopid','uniacid'],
        components: {
            VueUeditorWrap,upload
        },
	    data : function(){
            return {
                editerConfig : {
                    serverUrl : '',
                    autoHeightEnabled: false,
                    initialFrameHeight : 700,
                    initialFrameWidth : '100%',
                    UEDITOR_HOME_URL : window.location.protocol + '//' + window.location.host + '/web/resource/components/ueditor/',
                    toolbars: [[
                        'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    ]]
                },
                html : this.editorhtml,
                editor : '',
                showup : false,
                uploadurl : '',
            }
        },
        watch : {
            html(val){
                this.$emit(`${this.fnname}`, val);
            },
            editorhtml(val){
                if( !this.html ){
                    this.html = this.editorhtml;
                }
            },
        },
	    created(){
            let site = this.$util.apiUrl() . split('index.php');
           
            this.editerConfig.UEDITOR_HOME_URL = site[0] + 'resource/components/ueditor/';
            this.uploadurl = site[0] + 'index.php?c=utility&a=file&do=upload&upload_type=image&global=&dest_dir=';
            

	    },
        methods : {
            uploadimg(type){
                this.$refs.uploadref.showbox();
            },
            uploadmethod(e){
                
                this.editor.execCommand('insertimage', {
                    'src' : e.url,
                    '_src' : e.attachment,
                    'width' : '100%',
                    'alt' : e.filename
                });

            },
            addCustomButtom(editorId){

                var self = this;
                
                
                window.UE.registerUI('up-button', function (editor, uiName) {
                    self.editor = editor;

                    var btn = new window.UE.ui.Button({
                        name: uiName,
                        title: '上传图片',
                        cssRules: "background-position: -726px -77px;",
                        onclick: function () {
                            self.$refs.uploadref.showbox();
                        }
                    })
                    return btn;
                }, 0,editorId);

                //this.addCustomButtom();

            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
        }
	}
</script>

<style type="text/css">

</style>