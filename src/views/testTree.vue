<template>
  <div>

    <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
      <el-form-item label="活动名称">
        <el-input v-model="sizeForm.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="活动性质">
        <el-checkbox-group v-model="sizeForm.type">
          <el-checkbox-button label="美食/餐厅线上活动" name="type"></el-checkbox-button>
          <el-checkbox-button label="地推活动" name="type"></el-checkbox-button>
          <el-checkbox-button label="线下主题活动" name="type"></el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源">
        <el-radio-group v-model="sizeForm.resource" size="medium">
          <el-radio border label="线上品牌商赞助"></el-radio>
          <el-radio border label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <el-tree :data="data" :props="defaultProps" node-key="id" ref="tree" default-expand-all>
      <span class="custom-tree-node" slot-scope="{ node, data }">
<!--        <el-input v-model="data.label" size="mini" @blur="updateNode(node, data)"> </el-input>-->
        <span>{{data.label}}</span>
        <el-button type="text" icon="el-icon-plus" @click.stop.prevent="showAddChildDialog(node)">追加逻辑</el-button>
        <el-button type="text" icon="el-icon-plus" @click.stop.prevent="showEditChildDialog(node, data)">编辑逻辑</el-button>
      </span>
    </el-tree>



    <el-dialog :visible.sync="dialogVisible" title="追加逻辑" :before-close="handleClose"  :append-to-body="true">
      <el-form :model="form" label-width="80px">
        <el-form-item label="节点名称" :rules="[{ required: true, message: '请输入节点名称', trigger: 'blur' }]">
          <div class="block">
            <!--            <span class="demonstration">默认显示所有Tag</span>-->
            <el-cascader
              :options="options"
              :props="props"
              clearable
              v-model="form.label">
            </el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="节点属性1">
          <el-input v-model="form.attr1"></el-input>
        </el-form-item>
        <el-form-item label="节点属性2">
          <el-input v-model="form.attr2"></el-input>
        </el-form-item>
        <el-form-item label="节点属性3">
          <el-input v-model="form.attr3"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addChildNode">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogVisible1" title="编辑逻辑" :before-close="handleClose"  :append-to-body="true">
      <el-form :model="form" label-width="80px">
        <el-form-item label="节点名称" :rules="[{ required: true, message: '请输入节点名称', trigger: 'blur' }]">
<!--          <el-input v-model="form.label"></el-input>-->
          <div class="block">
<!--            <span class="demonstration">默认显示所有Tag</span>-->
            <el-cascader
              :options="options"
              :props="props"
              clearable
              v-model="form.label">
            </el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="节点属性1">
          <el-input v-model="form.attr1"></el-input>
        </el-form-item>
        <el-form-item label="节点属性2">
          <el-input v-model="form.attr2"></el-input>
        </el-form-item>
        <el-form-item label="节点属性3">
          <el-input v-model="form.attr3"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="updateNode">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      sizeForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      props: { multiple: true },
      options: [
        {
        value: 1,
        label: '东南',
        },
        {
          value: 2,
          label: '西南',
        },
      ],
      data: [
        {
          id: 1,
          label: '添加关联问题',
          children: [
            {
              id: 2,
              label: '与逻辑添加',
              attr1: '',
              attr2: '',
              attr3: '',
              children: []
            },
            {
              id: 3,
              label: '或逻辑添加',
              attr1: '',
              attr2: '',
              attr3: '',
              children: []
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogVisible: false,
      dialogVisible1: false,
      form: {
        label: '',
        attr1: '',
        attr2: '',
        attr3: ''
      },
      currentNode: null
    }
  },
  methods: {
    showAddChildDialog(node) {
      this.form = {
        label: '',
        attr1: '',
        attr2: '',
        attr3: ''
      }
      this.dialogVisible = true
      this.currentNode = node
    },
    showEditChildDialog(node, data) {
      this.form = {
        label: data.label,
        attr1: data.attr1,
        attr2: data.attr2,
        attr3: data.attr3,
      }
      this.dialogVisible1 = true
      this.currentNode = node
    },
    addChildNode() {
      if (this.form.label === '') {
        this.$message.error('节点名称不能为空')
        return
      }
      const newNode = {
        id: Date.now(),
        label: this.form.label,
        attr1: this.form.attr1,
        attr2: this.form.attr2,
        attr3: this.form.attr3,
        children: []
      }
      this.$set(this.currentNode.data, 'children', [...this.currentNode.data.children, newNode])
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    updateNode() {

      const newNode = {
        id: Date.now(),
        label: this.form.label,
        attr1: this.form.attr1,
        attr2: this.form.attr2,
        attr3: this.form.attr3,
        children: []
      }

      let nodeData =this.currentNode.data
      // console.log(node)
      this.$set(nodeData, 'label', this.form.label)
      this.$set(nodeData, 'attr1', this.form.attr1)
      this.$set(nodeData, 'attr2', this.form.attr2)
      this.$set(nodeData, 'attr3', this.form.attr3)

      this.dialogVisible1=false

    },
    onSubmit() {
      console.log('submit!');
    },
  }
}
</script>

<style>
.custom-tree-node {
  /*background-color: cyan;*/
  border: 1px darkcyan;
  flex: 1;
  display: flex;
  align-items: center;
  /*justify-content: space-between;*/
  font-size: 14px;
  padding-right: 8px;
}
</style>
