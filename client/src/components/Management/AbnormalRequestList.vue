<i18n locale="zh-CN" lang="yaml">
Time                         : 时间
User                         : 用户
User ID                      : 用户ID
Request                      : 请求
Response                     : 响应
Status Code                  : 状态码
Cost                         : 耗时
ms                           : 毫秒
Show detail                  : 显示请求详情
The full content is following: 完整内容如下
omitted.                     : 略

Abnormal Request data cleared: 异常请求数据已清空

Are you sure you want to clear the abnormal Request data?: 是否确认清空异常请求数据？
</i18n>

<template>
  <transition name="fade">
    <el-container direction="vertical" v-if="$store.state.isLoaded">
      <!-- 标题区 -->
      <el-header height="60px">
        <h1>
          {{ $t('Abnormal Reqs') }}
          <div class="header-control">
            <el-button @click="refresh" size="mini">
              <i class="fa fa-fw fa-refresh"></i>
              {{ $t('Refresh') }}
            </el-button>

            <el-radio-group v-model="type" size="mini">
              <el-radio-button v-for="type, i in C.ABNORMAL_REQUEST_TYPE" :key="type.key" :label="type.key">{{ type.name }}</el-radio-button>
            </el-radio-group>

            &#12288;
            <el-tooltip :content="$t('Clear')" placement="bottom" :enterable="false">
              <el-button @click="clear" size="mini">
                <i class="fa fa-fw fa-trash-o"></i>
              </el-button>
            </el-tooltip>
          </div>
        </h1>
      </el-header>

      <!-- 列表区 -->
      <el-main class="common-table-container">
        <div class="no-data-area" v-if="T.isNothing(data)">
          <h1 class="no-data-title">尚无任何近期异常请求</h1>

          <p class="no-data-tip">
            所有异常的请求会被系统搜集，并展示在此
          </p>
        </div>
        <el-table v-else
          class="common-table" height="100%"
          :data="data"
          :row-class-name="highlightRow">

          <el-table-column :label="$t('Time')" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.reqTime | datetime }}</span>
              <br>
              <span class="text-info">{{ scope.row.reqTime | fromNow }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('User')" width="200">
            <template slot-scope="scope">
              <strong>{{ scope.row.u_name || $t('Anonymity') }}</strong>

              <template v-if="scope.row.userId">
                <br>
                <span class="text-info">{{ $t('User ID') }}{{ $t(':') }}</span>
                <code class="text-code text-small">{{ scope.row.userId }}</code><CopyButton :content="scope.row.userId"></CopyButton>
              </template>
            </template>
          </el-table-column>

          <el-table-column :label="$t('Request')">
            <template slot-scope="scope">
              <strong v-if="scope.row.reqRouteName">{{ scope.row.reqRouteName }}<br></strong>
              <code class="text-code">{{ scope.row.reqMethod }} {{ decodeURI(scope.row.reqURL) }}</code><CopyButton :content="`${scope.row.reqMethod} ${ scope.row.reqURL }`"></CopyButton>
            </template>
          </el-table-column>

          <el-table-column :label="$t('Response')" align="right" width="240">
            <template slot-scope="scope">
              <span class="text-info">{{ $t('Status Code') }}{{ $t(':') }}</span>
              <strong v-if="scope.row.respStatusCode >= 500" class="text-bad status-code">{{ scope.row.respStatusCode }}</strong>
              <strong v-else-if="scope.row.respStatusCode >= 400" class="text-watch status-code">{{ scope.row.respStatusCode }}</strong>
              <strong v-else class="text-good status-code">{{ scope.row.respStatusCode }}</strong>

              <span v-if="getRespError(scope.row)">{{ $t('(') }}{{ getRespError(scope.row) }}{{ $t(')') }}</span>

              <span class="text-info" v-if="getRespMessage(scope.row)"><br>{{ $t(getRespMessage(scope.row)) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('Cost')" align="right" width="120">
            <template slot-scope="scope">
              {{ scope.row.reqCost }} <span class="text-info">{{ $t('ms') }}</span>
            </template>
          </el-table-column>

          <el-table-column width="150" align="right">
            <template slot-scope="scope">
              <el-button @click="showDetail(scope.row)" type="text">{{ $t('Show detail') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 翻页区 -->
      <Pager :pageInfo="pageInfo"></Pager>

      <LongTextDialog :title="$t('The full content is following')" :showDownload="true" ref="longTextDialog"></LongTextDialog>
    </el-container>
  </transition>
</template>

<script>
import LongTextDialog from '@/components/LongTextDialog'

export default {
  name: 'AbnormalRequestList',
  components: {
    LongTextDialog,
  },
  watch: {
    $route: {
      immediate: true,
      async handler(to, from) {
        await this.loadData();
      }
    },
    async type(val) {
      this.T.goToPageNumber(null);
      await this.loadData();
    },
  },
  methods: {
    highlightRow({row, rowIndex}) {
      return (this.$store.state.highlightedTableDataId === row.id) ? 'hl-row' : '';
    },
    async loadData() {
      let _listQuery = this.T.createListQuery();

      let apiRes = await this.T.callAPI('/api/v1/monitor/abnormal-requests/:type/do/list', {
        params: { type: this.type },
        query : _listQuery,
      });
      if (!apiRes.ok) return;

      this.data = apiRes.data;
      this.pageInfo = apiRes.pageInfo;

      this.$store.commit('updateLoadStatus', true);
    },
    getRespError(d) {
      return (d.respBody && d.respBody.error) || d.respError;
    },
    getRespMessage(d) {
      return (d.respBody && d.respBody.message) || d.respMessage;
    },
    showDetail(d) {
      this.$store.commit('updateHighlightedTableDataId', d.id);

      let httpInfoLines = [];

      httpInfoLines.push(`===== ${this.$t('Request')} =====`)

      httpInfoLines.push(`${d.reqMethod.toUpperCase()} ${d.reqURL}`)

      if (d.reqBodyDump) {
        httpInfoLines.push(d.reqBodyDump);
      }

      httpInfoLines.push(`\n===== ${this.$t('Response')} =====`)

      httpInfoLines.push(`Status Code: ${d.respStatusCode}`);

      if (d.respBody) {
        httpInfoLines.push(JSON.stringify(d.respBody, null, 2));
      } else if (d.respBodyDump) {
        httpInfoLines.push(d.respBodyDump);
      } else {
        httpInfoLines.push(`<${this.$t('omitted.')}>`);
      }

      let httpInfoTEXT = httpInfoLines.join('\n');

      let createTimeStr = this.M(d.createTime).utcOffset(8).format('YYYYMMDD_HHmmss');
      let fileName = `http-dump.${createTimeStr}`;
      this.$refs.longTextDialog.update(httpInfoTEXT, fileName);
    },
    async refresh() {
      await this.loadData();
    },
    async clear() {
      if (!await this.T.confirm(this.$t('Are you sure you want to clear the abnormal Request data?'))) return;

      let apiRes = await this.T.callAPI('/api/v1/monitor/abnormal-requests/do/clear', {
        alert : { okMessage: this.$t('Abnormal Request data cleared') },
      });

      await this.loadData();
    },
  },
  computed: {
  },
  props: {
  },
  data() {
    let _pageInfo = this.T.createPageInfo();

    return {
      data    : [],
      pageInfo: _pageInfo,


      type: 'statusCode5xx',
    }
  },
}
</script>

<style scoped>
/* Special Fix */
.el-radio-group {
  position: relative;
  top: 1px !important;
}

.status-code {
  font-size: 18px;
}
</style>

<style>

</style>
