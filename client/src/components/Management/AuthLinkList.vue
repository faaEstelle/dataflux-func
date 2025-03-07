<i18n locale="zh-CN" lang="yaml">
Info           : 信息
Recent Response: 响应
API Info       : API信息
Auth           : 认证
Expires        : 有效期
Never          : 长期有效
Throttling     : 限流
No limit       : 无限制
Shown in doc   : 在文档中显示
Hidden in doc  : 在文档中隐藏
Recent         : 近日调用
Today          : 今天
'-1 Day'       : 昨天
'-2 Day'       : 前天
Times          : 次
Response       : 响应速度
No info        : 暂无信息
ms             : 毫秒
Percentage     : 比例
Result         : 执行结果
Success        : 成功执行
Cached         : 命中缓存
Func Error     : 函数报错
Func Timeout   : 函数超时
API Timeout    : 接口超时
Bad return     : 非法结果
Unknow Error   : 未知错误

Auth Link disabled: 授权链接已禁用
Auth Link enabled : 授权链接已启用
Auth Link deleted : 授权链接已删除

Search Auth Link(ID, tags, note), Func(ID, kwargs, title, description, tags): 搜索授权链接（ID、标签、备注），函数（ID、参数、标题、描述、标签）
Check to show the contents created by outside systems: 勾选后展示由其他系统自动创建的内容
No Auth Link has ever been added: 从未添加过任何授权链接
Auth Link only supports synchronous calling: 授权链接只支持同步调用

Are you sure you want to disable the Auth Link?: 是否确认禁用此授权链接？
Are you sure you want to delete the Auth Link?: 是否确认删除此授权链接？
</i18n>

<template>
  <transition name="fade">
    <el-container direction="vertical" v-if="$store.state.isLoaded">
      <!-- 标题区 -->
      <el-header height="60px">
        <h1>
          {{ $t('Auth Link') }}
          <div class="header-control">
            <el-switch v-model="showCountCost" :inactive-text="$t('Info')" :active-text="$t('Recent Response')"></el-switch>
            &#12288;

            <FuzzySearchInput
              :dataFilter="dataFilter"
              :searchTip="$t('Search Auth Link(ID, tags, note), Func(ID, kwargs, title, description, tags)')">
            </FuzzySearchInput>

            <el-tooltip :content="$t('Check to show the contents created by outside systems')" placement="bottom" :enterable="false">
              <el-checkbox
                :border="true"
                size="small"
                v-model="dataFilter.origin"
                true-label="API,UI"
                false-label=""
                @change="T.changePageFilter(dataFilter)">{{ $t('Show all') }}</el-checkbox>
            </el-tooltip>
            <el-button @click="openSetup(null, 'add')" type="primary" size="small">
              <i class="fa fa-fw fa-plus"></i>
              {{ $t('New') }}
            </el-button>
          </div>
        </h1>
      </el-header>

      <!-- 列表区 -->
      <el-main class="common-table-container">
        <div class="no-data-area" v-if="T.isNothing(data)">
          <h1 class="no-data-title" v-if="T.isPageFiltered({ ignore: { origin: 'API,UI' } })">{{ $t('No matched data found') }}</h1>
          <h1 class="no-data-title" v-else>{{ $t('No Auth Link has ever been added') }}</h1>

          <p class="no-data-tip">
            出于安全性考虑，函数默认只能从内部网络访问
            <br>如需从外部访问，必须先为函数创建授权链接，通过授权链接访问函数
          </p>
        </div>
        <el-table v-else
          class="common-table" height="100%"
          :data="data"
          :row-class-name="highlightRow">

          <el-table-column :label="$t('Func')" min-width="420">
            <template slot-scope="scope">
              <FuncInfo
                :id="scope.row.func_id"
                :title="scope.row.func_title"
                :name="scope.row.func_name"
                :kwargsJSON="scope.row.funcCallKwargsJSON"></FuncInfo>

              <div>
                <span class="text-info">&#12288;ID</span>
                <code class="text-code">{{ scope.row.id }}</code><CopyButton :content="scope.row.id"></CopyButton>

                <template v-if="!T.isNothing(scope.row.tagsJSON) || !T.isNothing(scope.row.func_tagsJSON)">
                  <br>
                  <span class="text-info">&#12288;{{ $t('Tags') }}</span>
                  <el-tag size="mini" type="info" v-for="t in scope.row.func_tagsJSON" :key="t">{{ t }}</el-tag>
                  <el-tag size="mini" type="warning" v-for="t in scope.row.tagsJSON" :key="t">{{ t }}</el-tag>
                </template>
              </div>
            </template>
          </el-table-column>

          <template v-if="!showCountCost">
            <el-table-column :label="$t('API Info')" width="180">
              <template slot-scope="scope">
                <span class="text-info">{{ $t('Auth') }}{{ $t(':') }}</span>
                <el-tooltip effect="dark" :content="scope.row.apia_name" :disabled="!!!scope.row.apia_name" placement="top">
                  <span :class="{ 'text-main': !!scope.row.apia_id }">{{ C.API_AUTH_MAP.get(scope.row.apia_type).name }}</span>
                </el-tooltip>

                <br>
                <span class="text-info">{{ $t('Expires') }}{{ $t(':') }}</span>
                <span v-if="!scope.row.expireTime" class="text-good">{{ $t('Never') }}</span>
                <template v-else>
                  <span :class="T.isExpired(scope.row.expireTime) ? 'text-bad' : 'text-good'">{{ scope.row.expireTime | datetime }}</span>
                  <br>
                  <span class="text-info">{{ scope.row.expireTime | fromNow }}</span>
                </template>

                <br>
                <span class="text-info">{{ $t('Throttling') }}{{ $t(':') }}</span>
                <span v-if="T.isNothing(scope.row.throttlingJSON)" class="text-good">{{ $t('No limit') }}</span>
                <template v-else>
                  <template v-for="opt in C.AUTH_LINK_THROTTLING">
                    <span v-if="scope.row.throttlingJSON[opt.key]">{{ $tc(opt.name, scope.row.throttlingJSON[opt.key]) }}<br></span>
                  </template>
                </template>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Status')" width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.isDisabled" class="text-bad">{{ $t('Disabled') }}</span>
                <span v-else class="text-good">{{ $t('Enabled') }}</span>
                <br>
                <span v-if="scope.row.showInDoc" class="text-good">{{ $t('Shown in doc') }}</span>
                <span v-else class="text-bad">{{ $t('Hidden in doc') }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Note')" width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.note" class="text-info">{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <el-table-column align="right" width="300">
              <template slot-scope="scope">
                <el-button :disabled="T.isNothing(scope.row.func_id)" @click="showAPI(scope.row)" type="text">{{ $t('API Example') }}</el-button>

                <el-button :disabled="T.isNothing(scope.row.func_id)" v-if="scope.row.isDisabled" @click="quickSubmitData(scope.row, 'enable')" type="text">{{ $t('Enable') }}</el-button>
                <el-button :disabled="T.isNothing(scope.row.func_id)" v-else @click="quickSubmitData(scope.row, 'disable')" type="text">{{ $t('Disable') }}</el-button>

                <el-button :disabled="T.isNothing(scope.row.func_id)" @click="openSetup(scope.row, 'setup')" type="text">{{ $t('Setup') }}</el-button>

                <el-button @click="quickSubmitData(scope.row, 'delete')" type="text">{{ $t('Delete') }}</el-button>
              </template>
            </el-table-column>
          </template>

          <template v-else>
            <el-table-column :label="$t('Recent')" align="right" width="160"">
              <template slot-scope="scope">
                <template v-for="d, index in scope.row.recentRunningCount.slice(0, 3)">
                  <code>{{ [$t('Today'), $t('-1 Day'), $t('-2 Day')][index] }}:</code> <code class="count-cost-value">{{ d.count }}</code> {{ $t('Times') }}<br>
                </template>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Response')" align="right" width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.recentRunningCost.samples <= 0" class="text-info">{{ $t('No info') }}</span>
                <template v-else>
                  <code>MIN:</code> <code class="count-cost-value" :class="getCostClass(scope.row.recentRunningCost.min)">{{ scope.row.recentRunningCost.min }}</code> {{ $t('ms') }}<br>
                  <code>MAX:</code> <code class="count-cost-value" :class="getCostClass(scope.row.recentRunningCost.max)">{{ scope.row.recentRunningCost.max }}</code> {{ $t('ms') }}<br>
                  <code>AVG:</code> <code class="count-cost-value" :class="getCostClass(scope.row.recentRunningCost.avg)">{{ scope.row.recentRunningCost.avg }}</code> {{ $t('ms') }}<br>
                  <code>MID:</code> <code class="count-cost-value" :class="getCostClass(scope.row.recentRunningCost.mid)">{{ scope.row.recentRunningCost.mid }}</code> {{ $t('ms') }}<br>
                </template>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Percentage')" align="right" width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.recentRunningCost.samples <= 0" class="text-info">{{ $t('No info') }}</span>
                <template v-else>
                  <code>P75:</code> <code class="count-cost-value" :class="getCostClass(scope.row.recentRunningCost.p75)">{{ scope.row.recentRunningCost.p75 }}</code> {{ $t('ms') }}<br>
                  <code>P95:</code> <code class="count-cost-value" :class="getCostClass(scope.row.recentRunningCost.p95)">{{ scope.row.recentRunningCost.p95 }}</code> {{ $t('ms') }}<br>
                  <code>P99:</code> <code class="count-cost-value" :class="getCostClass(scope.row.recentRunningCost.p99)">{{ scope.row.recentRunningCost.p99 }}</code> {{ $t('ms') }}<br>
                </template>
              </template>
            </el-table-column>

            <el-table-column :label="$t('Result')" align="right" width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.recentRunningStatus.total <= 0" class="text-info">{{ $t('No info') }}</span>
                <template v-else>
                  <template v-for="opt, k in RUNNING_STATUS_MAP">
                    <template v-if="scope.row.recentRunningStatus[k]">
                      <code>{{ opt.title }}:</code>
                      <code class="count-cost-value" :class="opt.class">{{ (scope.row.recentRunningStatus[k] / scope.row.recentRunningStatus.total * 100).toFixed(1) }}</code> %<br>
                    </template>
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-main>

      <!-- 翻页区 -->
      <Pager :pageInfo="pageInfo"></Pager>

      <APIExampleDialog ref="apiExampleDialog"
        :description="$t('Auth Link only supports synchronous calling')"
        :showPostExample="true"
        :showPostExampleSimplified="true"
        :showGetExample="true"
        :showGetExampleSimplified="true"></APIExampleDialog>
    </el-container>
  </transition>
</template>

<script>
import APIExampleDialog from '@/components/APIExampleDialog'

export default {
  name: 'AuthLinkList',
  components: {
    APIExampleDialog,
  },
  watch: {
    $route: {
      immediate: true,
      async handler(to, from) {
        await this.loadData();
      }
    },
    '$store.state.isLoaded': function(val) {
      if (!val) return;

      setImmediate(() => {
        this.T.autoScrollTable(this.$store.state.AuthLinkList_scrollY);
      });
    },
  },
  methods: {
    highlightRow({row, rowIndex}) {
      return (this.$store.state.highlightedTableDataId === row.id) ? 'hl-row' : '';
    },
    async loadData() {
      // 默认过滤条件
      let _listQuery = this.T.createListQuery();
      if (this.T.isNothing(this.dataFilter.origin)) {
        _listQuery.origin = 'UI';
      }

      let apiRes = await this.T.callAPI_get('/api/v1/auth-links/do/list', {
        query: _listQuery,
      });
      if (!apiRes.ok) return;

      this.data = apiRes.data;
      this.pageInfo = apiRes.pageInfo;

      this.$store.commit('updateLoadStatus', true);
    },
    async quickSubmitData(d, operation) {
      switch(operation) {
        case 'disable':
          if (!await this.T.confirm(this.$t('Are you sure you want to disable the Auth Link?'))) return;
          break;

        case 'delete':
          if (!await this.T.confirm(this.$t('Are you sure you want to delete the Auth Link?'))) return;
          break;
      }

      let apiRes = null;
      switch(operation) {
        case 'disable':
          apiRes = await this.T.callAPI('post', '/api/v1/auth-links/:id/do/modify', {
            params: { id: d.id },
            body  : { data: { isDisabled: true } },
            alert : { okMessage: this.$t('Auth Link disabled') },
          });
          break;

        case 'enable':
          apiRes = await this.T.callAPI('post', '/api/v1/auth-links/:id/do/modify', {
            params: { id: d.id },
            body  : { data: { isDisabled: false } },
            alert : { okMessage: this.$t('Auth Link enabled') },
          });
          break;

        case 'delete':
          apiRes = await this.T.callAPI('/api/v1/auth-links/:id/do/delete', {
            params: { id: d.id },
            alert : { okMessage: this.$t('Auth Link deleted') },
          });
          break;
      }
      if (!apiRes || !apiRes.ok) return;

      this.$store.commit('updateHighlightedTableDataId', d.id);

      await this.loadData();
    },
    openSetup(d, target) {
      let prevRouteQuery = this.T.packRouteQuery();

      this.$store.commit('updateAuthLinkList_scrollY', this.T.getTableScrollY());
      switch(target) {
        case 'add':
          this.$router.push({
            name : 'auth-link-add',
            query: prevRouteQuery,
          })
          break;

        case 'setup':
          this.$store.commit('updateHighlightedTableDataId', d.id);

          this.$router.push({
            name  : 'auth-link-setup',
            params: {id: d.id},
            query : prevRouteQuery,
          })
          break;
      }
    },
    async showAPI(d) {
      // 获取函数详情
      let apiRes = await this.T.callAPI_getOne('/api/v1/funcs/do/list', d.funcId);
      if (!apiRes.ok) return;

      let funcKwargs = apiRes.data.kwargsJSON;

      // 生成API请求示例
      let apiURLExample = this.T.formatURL('/api/v1/al/:id', {
        baseURL: true,
        params : {id: d.id},
      });

      let funcCallKwargsJSON = {};
      for (let k in d.funcCallKwargsJSON) if (d.funcCallKwargsJSON.hasOwnProperty(k)) {
        if (this.common.isFuncArgumentPlaceholder(d.funcCallKwargsJSON[k])) {
          funcCallKwargsJSON[k] = d.funcCallKwargsJSON[k];
        }
      }
      let apiBodyExample = { kwargs: funcCallKwargsJSON };

      this.$store.commit('updateHighlightedTableDataId', d.id);
      this.$refs.apiExampleDialog.update(apiURLExample, apiBodyExample, funcKwargs);
    },
    getCostClass(cost) {
      if (cost < 3000) {
        return 'text-good';
      } else if (cost < 10000) {
        return 'text-watch';
      } else {
        return 'text-bad';
      }
    },
  },
  computed: {
    RUNNING_STATUS_MAP() {
      return {
        OK: {
          title: this.$t('Success'),
          class: 'text-good',
        },
        cached: {
          title: this.$t('Cached'),
          class: 'text-good',
        },
        EFuncFailed: {
          title: this.$t('Func Error'),
          class: 'text-bad',
        },
        EFuncTimeout: {
          title: this.$t('Func Timeout'),
          class: 'text-bad',
        },
        EAPITimeout: {
          title: this.$t('API Timeout'),
          class: 'text-bad',
        },
        EFuncResultParsingFailed: {
          title: this.$t('Bad return'),
          class: 'text-bad',
        },
        UnknowError: {
          title: this.$t('Unknow Error'),
          class: 'text-bad',
        },
      }
    },
  },
  props: {
  },
  data() {
    let _pageInfo   = this.T.createPageInfo();
    let _dataFilter = this.T.createListQuery();

    return {
      data    : [],
      pageInfo: _pageInfo,

      dataFilter: {
        _fuzzySearch: _dataFilter._fuzzySearch,
        origin      : _dataFilter.origin,
      },

      showCountCost: false,
    }
  },
}
</script>

<style scoped>
code.count-cost-value {
  display: inline-block;
  width: 40px;
  text-align: right;
  border-bottom: 1px solid grey;
  line-height: 14px;
  font-size: 12px;
}
</style>

<style>
</style>
