import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import * as toolkit from '@/toolkit'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/Index.vue'),
  },
  {
    path: '/sign-out',
    name: 'sign-out',
    component: () => import('../views/SignOut.vue'),
  },
  {
    path: '/editor',
    component: () => import('../views/Editor.vue'),
    children: [
      {
        path: 'intro',
        name: 'intro',
        component: () => import('../components/Editor/Intro.vue'),
      },
      {
        path: 'code-editor/:id',
        name: 'code-editor',
        component: () => import('../components/Editor/CodeEditor.vue'),
      },
      {
        path: 'code-viewer/:id',
        name: 'code-viewer',
        component: () => import('../components/Editor/CodeViewer.vue'),
      },
      {
        path: 'script-set-add',
        name: 'script-set-add',
        component: () => import('../components/Editor/ScriptSetSetup.vue'),
      },
      {
        path: 'script-set-setup/:id',
        name: 'script-set-setup',
        component: () => import('../components/Editor/ScriptSetSetup.vue'),
      },
      {
        path: 'script-add/:id',
        name: 'script-add',
        component: () => import('../components/Editor/ScriptSetup.vue'),
      },
      {
        path: 'script-setup/:id',
        name: 'script-setup',
        component: () => import('../components/Editor/ScriptSetup.vue'),
      },
      {
        path: 'data-source-add',
        name: 'data-source-add',
        component: () => import('../components/Editor/DataSourceSetup.vue'),
      },
      {
        path: 'data-source-setup/:id',
        name: 'data-source-setup',
        component: () => import('../components/Editor/DataSourceSetup.vue'),
      },
      {
        path: 'env-variable-add',
        name: 'env-variable-add',
        component: () => import('../components/Editor/EnvVariableSetup.vue'),
      },
      {
        path: 'env-variable-setup/:id',
        name: 'env-variable-setup',
        component: () => import('../components/Editor/EnvVariableSetup.vue'),
      },
    ]
  },
  {
    path: '/management',
    name: 'management',
    component: () => import('../views/Management.vue'),
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('../components/Management/Overview.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../components/Management/About.vue'),
      },

      {
        path: 'api-auth-list',
        name: 'api-auth-list',
        component: () => import('../components/Management/APIAuthList.vue'),
      },
      {
        path: 'api-auth-add',
        name: 'api-auth-add',
        component: () => import('../components/Management/APIAuthSetup.vue'),
      },
      {
        path: 'api-auth-setup/:id',
        name: 'api-auth-setup',
        component: () => import('../components/Management/APIAuthSetup.vue'),
      },

      {
        path: 'auth-link-list',
        name: 'auth-link-list',
        component: () => import('../components/Management/AuthLinkList.vue'),
      },
      {
        path: 'auth-link-add',
        name: 'auth-link-add',
        component: () => import('../components/Management/AuthLinkSetup.vue'),
      },
      {
        path: 'auth-link-setup/:id',
        name: 'auth-link-setup',
        component: () => import('../components/Management/AuthLinkSetup.vue'),
      },

      {
        path: 'crontab-config-list',
        name: 'crontab-config-list',
        component: () => import('../components/Management/CrontabConfigList.vue'),
      },
      {
        path: 'crontab-config-add',
        name: 'crontab-config-add',
        component: () => import('../components/Management/CrontabConfigSetup.vue'),
      },
      {
        path: 'crontab-config-setup/:id',
        name: 'crontab-config-setup',
        component: () => import('../components/Management/CrontabConfigSetup.vue'),
      },
      {
        path: 'crontab-task-info-list/:id',
        name: 'crontab-task-info-list',
        component: () => import('../components/Management/CrontabTaskInfoList.vue'),
      },

      {
        path: 'batch-list',
        name: 'batch-list',
        component: () => import('../components/Management/BatchList.vue'),
      },
      {
        path: 'batch-add',
        name: 'batch-add',
        component: () => import('../components/Management/BatchSetup.vue'),
      },
      {
        path: 'batch-setup/:id',
        name: 'batch-setup',
        component: () => import('../components/Management/BatchSetup.vue'),
      },
      {
        path: 'batch-task-info-list/:id',
        name: 'batch-task-info-list',
        component: () => import('../components/Management/BatchTaskInfoList.vue'),
      },

      {
        path: 'script-set-export-history-list',
        name: 'script-set-export-history-list',
        component: () => import('../components/Management/ScriptSetExportHistoryList.vue'),
      },
      {
        path: 'script-set-export',
        name: 'script-set-export',
        component: () => import('../components/Management/ScriptSetExport.vue'),
      },
      {
        path: 'script-set-import-history-list',
        name: 'script-set-import-history-list',
        component: () => import('../components/Management/ScriptSetImportHistoryList.vue'),
      },
      {
        path: 'script-set-import',
        name: 'script-set-import',
        component: () => import('../components/Management/ScriptSetImport.vue'),
      },

      {
        path: 'script-recover-point-list',
        name: 'script-recover-point-list',
        component: () => import('../components/Management/ScriptRecoverPointList.vue'),
      },
      {
        path: 'script-recover-point-add',
        name: 'script-recover-point-add',
        component: () => import('../components/Management/ScriptRecoverPointAdd.vue'),
      },

      {
        path: 'user-list',
        name: 'user-list',
        component: () => import('../components/Management/UserList.vue'),
      },
      {
        path: 'user-add',
        name: 'user-add',
        component: () => import('../components/Management/UserSetup.vue'),
      },
      {
        path: 'user-setup/:id',
        name: 'user-setup',
        component: () => import('../components/Management/UserSetup.vue'),
      },

      {
        path: 'operation-record-list',
        name: 'operation-record-list',
        component: () => import('../components/Management/OperationRecordList.vue'),
      },

      {
        path: 'script-log-list',
        name: 'script-log-list',
        component: () => import('../components/Management/ScriptLogList.vue'),
      },
      {
        path: 'script-failure-list',
        name: 'script-failure-list',
        component: () => import('../components/Management/ScriptFailureList.vue'),
      },

      /* 实验性功能 */
      {
        path: 'experimental-features',
        name: 'experimental-features',
        component: () => import('../components/Management/ExperimentalFeatures.vue'),
      },
      {
        path: 'script-market',
        name: 'script-market',
        component: () => import('../components/Management/ScriptMarket.vue'),
      },

      {
        path: 'pip-tool',
        name: 'pip-tool',
        component: () => import('../components/Management/PIPTool.vue'),
      },

      {
        path: 'file-manager',
        name: 'file-manager',
        component: () => import('../components/Management/FileManager.vue'),
      },
      {
        path: 'file-service-list',
        name: 'file-service-list',
        component: () => import('../components/Management/FileServiceList.vue'),
      },
      {
        path: 'file-service-add',
        name: 'file-service-add',
        component: () => import('../components/Management/FileServiceSetup.vue'),
      },
      {
        path: 'file-service-setup/:id',
        name: 'file-service-setup',
        component: () => import('../components/Management/FileServiceSetup.vue'),
      },
      {
        path: 'func-cache-manager',
        name: 'func-cache-manager',
        component: () => import('../components/Management/FuncCacheManager.vue'),
      },
      {
        path: 'func-store-manager',
        name: 'func-store-manager',
        component: () => import('../components/Management/FuncStoreManager.vue'),
      },

      {
        path: 'sys-stats',
        name: 'sys-stats',
        component: () => import('../components/Management/SysStats.vue'),
      },
      {
        path: 'system-logs',
        name: 'system-logs',
        component: () => import('../components/Management/SystemLogs.vue'),
      },
      {
        path: 'abnormal-request-list',
        name: 'abnormal-request-list',
        component: () => import('../components/Management/AbnormalRequestList.vue'),
      },

      {
        path: 'access-key-add',
        name: 'access-key-add',
        component: () => import('../components/Management/AccessKeySetup.vue'),
      },
      {
        path: 'access-key-list',
        name: 'access-key-list',
        component: () => import('../components/Management/AccessKeyList.vue'),
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/Setting.vue'),
    children: [
      {
        path: 'clear-cache',
        name: 'clear-cache',
        component: () => import('../components/Setting/ClearCache.vue'),
      },
      {
        path: 'code-editor-setup',
        name: 'code-editor-setup',
        component: () => import('../components/Setting/CodeEditorSetup.vue'),
      },
      {
        path: 'profile-setup',
        name: 'profile-setup',
        component: () => import('../components/Setting/ProfileSetup.vue'),
      },
      {
        path: 'password-setup',
        name: 'password-setup',
        component: () => import('../components/Setting/PasswordSetup.vue'),
      },
    ],
  },
  {
    path: '/func-doc',
    name: 'func-doc',
    component: () => import('../views/FuncDoc.vue'),
  },
  {
    path: '/auth-link-func-doc',
    name: 'auth-link-func-doc',
    component: () => import('../views/AuthLinkFuncDoc.vue'),
  },
  {
    path: '/dream',
    name: 'dream',
    component: () => import('../views/Dream.vue'),
  },
  {
    path: '/blueprint',
    name: 'blueprint',
    component: () => import('../views/Blueprint.vue'),
  },
];

const router = new VueRouter({
  routes,
});

const noAuthRoutes = [
  'index',
  'func-doc',
  'auth-link-func-doc',
  'dream',
];

router.beforeEach((to, from, next) => {
  // 切换路径时，已加载标记置为false，等待加载完再显示
  // 防止屏幕不和谐闪烁
  store.commit('updateLoadStatus', false);

  // 登录跳转
  if (!store.state.xAuthToken && noAuthRoutes.indexOf(to.name) < 0) {
    return next({name: 'index'});
  }
  if (store.state.xAuthToken && to.name === 'index') {
    return next({name: 'intro'});
  }

  return next();
});

router.afterEach((to, from) => {
});

export default router
