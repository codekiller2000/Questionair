// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
/**
 * 基础菜单
 */

// 问卷管理
import QnFill from "../views/QnFill.vue";
import EditQn from "../views/EditQn.vue";
import SubQnFill from "../views/SubQnFill.vue";

// 商品管理
import Goods from '@/views/goods/Goods';
import Question from '@/views/question/index';
// 机器信息管理
import Machine from '@/views/machine/Machine';
// 货道信息管理
import MachineAisle from '@/views/machine/MachineAisle';
/**
 * 订单管理
 */
// 交易订单
import Order from '@/views/pay/Order';
/**
 * 系统管理
 */
// 用户管理
import user from '@/views/system/user';
// 受试者管理
import subject from "../views/system/subject.vue";
// 菜单管理
import Module from '@/views/system/Module';
// 角色管理
import Role from '@/views/system/Role';
// 公司管理
import Dept from '@/views/system/Dept';
// 系统环境变量
import Variable from '@/views/system/Variable';
// 权限管理
import Permission from '@/views/system/Permission';
/**
 * 支付管理
 */
// 支付配置信息
import MachineConfig from '@/views/machine/MachineConfig';
// 支付配置
import Config from '@/views/pay/Config';
/**
 * 数据监控
 */
// 监控查询
import druidLogin from '@/views/druid/login';

// 图表界面
import statistics from '@/views/charts/statistics';
import subjuects from "../views/system/subject.vue";

// 启用路由
Vue.use(Router);

// 导出路由
export default new Router({
    routes: [{
        path: '/',
        name: '',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/login',
        name: 'login',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/index',
        name: 'index',
        component: index,
        iconCls: 'el-icon-tickets',
        children: [
          {
            path: '/QnFill',
            name: 'QnFill',
            component: QnFill,
            meta: {
              requireAuth: true
            }
          },{
            path: '/SubQnFill',
            name: 'SubQnFill',
            component: SubQnFill,
            meta: {
              requireAuth: true
            }
          },{
            path: '/EditQn',
            name: 'EditQn',
            component: EditQn,
            meta: {
              requireAuth: true
            }
          },{
            path: '/goods/Goods',
            name: '商品管理',
            component: Goods,
            meta: {
                requireAuth: true
            }
        },{
            path: '/question/index',
            name: '问ti管理',
            component: Question,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/machine/Machine',
            name: '机器信息管理',
            component: Machine,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/machine/MachineAisle',
            name: '货道信息管理',
            component: MachineAisle,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/pay/Order',
            name: '交易订单',
            component: Order,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/user',
            name: '用户管理',
            component: user,
            meta: {
                requireAuth: true
            }
        },
          {
            path: '/system/subject',
            name: '受试者管理',
            component: subject,
            meta: {
              requireAuth: true
            }
          },{
            path: '/system/Module',
            name: '菜单管理',
            component: Module,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Role',
            name: '角色管理',
            component: Role,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Dept',
            name: '公司管理',
            component: Dept,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Variable',
            name: '系统环境变量',
            component: Variable,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Permission',
            name: '权限管理',
            component: Permission,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/machine/MachineConfig',
            name: '支付配置信息',
            component: MachineConfig,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/pay/Config',
            name: '支付配置',
            component: Config,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/druid/login',
            name: '监控查询',
            component: druidLogin,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/charts/statistics',
            name: '数据可视化',
            component: statistics,
            meta: {
                requireAuth: true
            }
        }]
    }]
})
