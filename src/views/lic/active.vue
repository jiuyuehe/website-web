<template>
  <div class="app-container">
    <el-form ref="licForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="系统版本">
        <el-radio-group v-model="form.version">
          <el-radio label="4.5.0">4.6.0之前</el-radio>
          <el-radio label="4.6.0">4.6.0之后</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="激活方式">
        <el-radio-group v-model="form.type">
          <el-radio label="create">首次官网激活</el-radio>
          <el-radio label="update">授权更新</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="旧的授权码" prop="licCode">
        <el-input v-model="form.licCode" type="textarea"/>
      </el-form-item>
      <el-form-item label="添加模块" v-show="form.version == '4.6.0'">
        <el-select style="width: 100%" v-model="form.modules" multiple clearable filterable>
          <el-option v-for="item in modules" :value="item.code" :label="item.name">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业名" prop="entName" v-if="form.type == 'create'"
                    :rules="{ required: true, message: '企业名不能为空', trigger: 'blur' }">
        <el-input v-model="form.entName" />
      </el-form-item>
      <el-form-item label="联系人" prop="contact" v-if="form.type == 'create'"
                    :rules="{ required: true, message: '联系人不能为空', trigger: 'blur' }">
        <el-input v-model="form.contact"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile" v-if="form.type == 'create'"
                    :rules="{ required: true, message: '联系电话不能为空', trigger: 'blur'}">
        <el-input v-model="form.mobile"/>
      </el-form-item>
      <el-form-item label="邮箱" v-if="form.type == 'create'">
        <el-input v-model="form.email"/>
      </el-form-item>
      <el-form-item label="授权时长" prop="days">
        <el-select v-model="form.days">
          <el-option label="一周" :value="7" />
          <el-option label="半个月" :value="15" />
          <el-option label="一个月" :value="30" />
          <el-option label="永久" :value="0" v-if="isAdmin"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户数限制类型" prop="limitType">
        <el-radio-group v-model="form.limitType">
          <el-radio :label="0">最大账号数</el-radio>
          <el-radio :label="1">最大并发数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账号数" prop="number">
        <el-input v-model="form.number" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">生成新的授权码</el-button>
<!--        <el-button @click="onCancel">取消</el-button>-->
      </el-form-item>
    </el-form>
    <div v-if="displayNewLicDiv">
      <el-row>
        <h3>新的授权码</h3>
      </el-row>
      <el-row class="lic-row">
        <div @mouseenter="mouseover()" @mouseleave="mouseLeave()">
          <el-button type="primary" class="lic-copy" v-show="displayLicCopy"
                  v-clipboard:copy="newLic"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">复制授权码</el-button>
          <p class="lic-p">
            {{newLic}}
          </p>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {updateLic} from '@/api/lic.js'
  export default {
    name: "active",
    computed:{
      isAdmin(){
        if(this.$store.getters.userType == 3){
          return true;
        }
        return false;
      }
    },
    data(){
      return {
        form: {
          modules: [],
          version: '4.5.0',
          type: 'create',
          licCode: '',
          entName: '',
          contact: '',
          mobile: '',
          email: '',
          days: 7,
          limitType: 0, // 0：最大用户数，1：并发数
          number: 3
        },
        modules: [{
          "code": "person",
          "name": "个人空间"
        }, {
          "code": "share",
          "name": "共享空间"
        }, {
          "code": "nas",
          "name": "nas空间"
        }, {
          "code": "group",
          "name": "群组空间"
        }, {
          "code": "news",
          "name": "门户空间"
        }, {
          "code": "knowledge",
          "name": "知识库"
        }, {
          "code": "im",
          "name": "im聊天"
        }, {
          "code": "forum",
          "name": "群讨论"
        }, {
          "code": "note",
          "name": "云笔记"
        }, {
          "code": "label",
          "name": "文档标签"
        }, {
          "code": "register",
          "name": "用户注册"
        }, {
          "code": "code",
          "name": "验证码"
        }, {
          "code": "smsCode",
          "name": "短信验证码"
        }, {
          "code": "portal",
          "name": "企业门户"
        }, {
          "code": "h5",
          "name": "H5"
        }, {
          "code": "shuiyin",
          "name": "文档水印"
        }, {
          "code": "template",
          "name": "文档模板"
        }, {
          "code": "dingtalk",
          "name": "钉钉集成"
        }, {
          "code": "wechat",
          "name": "微信集成"
        }, {
          "code": "wxpub",
          "name": "微信公众号集成"
        }, {
          "code": "ad",
          "name": "AD域集成"
        }, {
          "code": "mail",
          "name": "邮件集成"
        }, {
          "code": "FTS",
          "name": "全文检索"
        }, {
          "code": "officeOnline",
          "name": "在线编辑"
        }, {
          "code": "exchange",
          "name": "文件摆渡"
        }, {
          "code": "approval",
          "name": "文档审批"
        }, {
          "code": "review",
          "name": "文档审阅"
        }, {
          "code": "sensitive",
          "name": "敏感词检测"
        }, {
          "code": "notice",
          "name": "系统通知"
        }, {
          "code": "feedback",
          "name": "用户反馈"
        }],
        rules: {
          licCode: [{ required: true, message: '授权码不能为空', trigger: 'blur' }],
          number: [{ required: true, message: '授权数不能为空', trigger: 'blur' }],
          days: [{ required: true, message: '授权时长不能为空', trigger: 'change' }],
          limitType: [{ required: true, message: '用户数限制类型时间不能为空', trigger: 'change' }],

        },
        newLic: '',
        displayLicCopy: false,
        displayNewLicDiv: false
      }
    },
    methods: {
      onSubmit() {
        this.$refs['licForm'].validate((valid) => {
          if (valid) {
            if(this.form.version == '4.5.0'){
              this.form.modules = undefined
            }
            updateLic(this.form).then(response=>{
              this.$message({type: 'success', message: '成功!'})
              this.displayNewLicDiv = true
              this.newLic = response.data
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      mouseover() {
        this.displayLicCopy = !this.displayLicCopy
      },
      mouseLeave() {
        this.displayLicCopy = !this.displayLicCopy
      },
      onCopy: function (e) {
        this.$message({type: 'success', message: '复制成功!'})
      },
      onError: function (e) {
        this.$message({
          message: '复制失败!',
          type: 'error'
        })

      }
    }
  }
</script>

<style scoped>
  .lic-row {
    background: #fafafa
  }
  .lic-row:hover
  {
    background-color: #d8d8d8;
  }
  .lic-copy {
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .lic-p {
    width: 100%;
    height: auto;
    word-wrap:break-word;
    word-break:break-all;
    overflow: hidden;
    font-size: 18px;
    color: #323232;
    font-family: "微软雅黑";
  }
</style>
