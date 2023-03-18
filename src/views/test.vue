<template>
  <div id="app">
    <el-button type="primary" @click="saveFormJson"><i class="el-icon-finished" />保存</el-button>
    <el-button plain @click="goBack()">返回</el-button>
    <v-form-designer ref="vfDesigner" :field-list-api="fieldListApi" :banned-widgets="testBanned"
                     :designer-config="designerConfig">
      <!-- 自定义按钮插槽演示 -->
      <template #customToolButtons>
        <el-button type="primary" @click="saveFormJson">保存</el-button>
      </template>
    </v-form-designer>
<!--    <el-button type="text" @click="saveFormJson"><i class="el-icon-finished" />保存</el-button>-->
<!--    <el-button type="text" @click="test"><i class="el-icon-finished" />测试</el-button>-->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      fieldListApi: {
        URL: 'https://www.fastmock.site/mock/2de212e0dc4b8e0885fea44ab9f2e1d0/vform/listField',
        labelKey: 'fieldLabel',
        nameKey: 'fieldName'
      },

      testBanned: [
        //'sub-form',
        //'alert',
      ],

      designerConfig: {
        languageMenu: true,
        //externalLink: false,
        //formTemplates: false,
        //eventCollapse: false,
        //clearDesignerButton: false,
        //previewFormButton: false,

        //presetCssCode: '.abc { font-size: 16px; }',
      }
    }
  },
  methods: {
    saveFormJson() {

      // 以下就是获取创建模板的数组
      //  "widgetList"数组  和   "formConfig"对象
      let formJson = this.$refs.vfDesigner.getFormJson()
      this.$store.commit('saveSubTemplateData',formJson)
      //TODO: 将formJson提交给后端保存接口，需自行实现！！
      console.log(formJson)
      this.$message.success('表单已保存！')
    },
    parentHandleclick(object) {
      // console.log(object)
      let newObject={}

      let widgetList1=object.widgetList
      let formConfig1=object.formConfig
      newObject={
        widgetList:widgetList1,
        formConfig:formConfig1,
      }
      console.log(newObject)
      this.$store.commit('saveSubTemplateData',newObject)
      this.$refs.vfDesigner.setFormJson(newObject)
    },
    goBack() {
      this.$router.back()
    },
    // test() {
    //   this.$refs.vfDesigner.setFormJson({"widgetList":[{"type":"radio","icon":"radio-field","formItemFlag":true,"options":{"name":"radio29410","label":"radio","labelAlign":"","defaultValue":null,"columnWidth":"200px","size":"","displayStyle":"inline","buttonStyle":false,"border":false,"labelWidth":null,"labelHidden":false,"disabled":false,"hidden":false,"optionItems":[{"label":"radio 1","value":1},{"label":"radio 2","value":2},{"label":"radio 3","value":3}],"required":false,"requiredHint":"","validation":"","validationHint":"","customClass":[],"labelIconClass":null,"labelIconPosition":"rear","labelTooltip":null,"onCreated":"","onMounted":"","onChange":"","onValidate":""},"id":"radio29410"},{"type":"checkbox","icon":"checkbox-field","formItemFlag":true,"options":{"name":"checkbox55173","label":"checkbox","labelAlign":"","defaultValue":[],"columnWidth":"200px","size":"","displayStyle":"inline","buttonStyle":false,"border":false,"labelWidth":null,"labelHidden":false,"disabled":false,"hidden":false,"optionItems":[{"label":"check 1","value":1},{"label":"check 2","value":2},{"label":"check 3","value":3}],"required":false,"requiredHint":"","validation":"","validationHint":"","customClass":[],"labelIconClass":null,"labelIconPosition":"rear","labelTooltip":null,"onCreated":"","onMounted":"","onChange":"","onValidate":""},"id":"checkbox55173"}],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules","labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"","functions":"","layoutType":"PC","onFormCreated":"","onFormMounted":"","onFormDataChange":""}})
    // },

  }
}
</script>

<style >
#app {
  height: 100%;
}
.form-widget-container {
  margin-top: 40px;
}
.right-toolbar{
  position: relative;
  z-index: 999;
}
</style>
