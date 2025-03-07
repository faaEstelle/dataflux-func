<i18n locale="zh-CN" lang="yaml">
Administrator: 系统管理员

User disabled: 用户已禁用
User enabled : 用户已启用

Search User(ID, username, name): 搜索用户（ID、用户名、名称）
No User has ever been added: 从未添加过任何用户

Are you sure you want to disable the User?: 是否确认禁用此用户？
</i18n>

<template>
  <transition name="fade">
    <el-container direction="vertical" v-if="$store.state.isLoaded">
      <!-- 标题区 -->
      <el-header height="60px">
        <h1>
          {{ $t('User Manager') }}
          <div class="header-control">
            <FuzzySearchInput
              :dataFilter="dataFilter"
              :searchTip="$t('Search User(ID, username, name)')">
            </FuzzySearchInput>

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
          <h1 class="no-data-title" v-if="T.isPageFiltered()">{{ $t('No matched data found') }}</h1>
          <h1 class="no-data-title" v-else>{{ $t('No User has ever been added') }}</h1>

          <p class="no-data-tip">
            添加成员，允许其他用户使用本平台
          </p>
        </div>
        <el-table
          class="common-table" height="100%"
          :data="data"
          :row-class-name="highlightRow">

          <el-table-column :label="$t('Username')">
            <template slot-scope="scope">
              <code class="text-code text-small">{{ scope.row.username }}</code><CopyButton :content="scope.row.username"></CopyButton>
            </template>
          </el-table-column>

          <el-table-column :label="$t('Name')">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('Status')" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isDisabled" class="text-bad">{{ $t('Disabled') }}</span>
              <span v-else class="text-good">{{ $t('Enabled') }}</span>
            </template>
          </el-table-column>

          <el-table-column align="right" width="200">
            <template slot-scope="scope">
              <span v-if="Array.isArray(scope.row.roles) && scope.row.roles.indexOf('sa') >= 0" class="text-bad">{{ $t('Administrator') }}</span>
              <template v-else>
                <el-button v-if="scope.row.isDisabled" @click="quickSubmitData(scope.row, 'enable')" type="text">{{ $t('Enable') }}</el-button>
                <el-button v-else @click="quickSubmitData(scope.row, 'disable')" type="text">{{ $t('Disable') }}</el-button>

                <el-button @click="openSetup(scope.row, 'setup')" type="text">{{ $t('Setup') }}</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 翻页区 -->
      <Pager :pageInfo="pageInfo"></Pager>
    </el-container>
  </transition>
</template>

<script>
export default {
  name: 'UserList',
  components: {
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
        this.T.autoScrollTable(this.$store.state.UserList_scrollY);
      });
    },
  },
  methods: {
    highlightRow({row, rowIndex}) {
      return (this.$store.state.highlightedTableDataId === row.id) ? 'hl-row' : '';
    },
    async loadData() {
      let apiRes = await this.T.callAPI_get('/api/v1/users/do/list', {
        query: this.T.createListQuery({ sort: ['seq'] }),
      });
      if (!apiRes.ok) return;

      this.data = apiRes.data;
      this.pageInfo = apiRes.pageInfo;

      this.$store.commit('updateLoadStatus', true);
    },
    async quickSubmitData(d, operation) {
      switch(operation) {
        case 'disable':
          if (!await this.T.confirm(this.$t('Are you sure you want to disable the User?'))) return;
          break;
      }

      let apiRes = null;
      switch(operation) {
        case 'disable':
          apiRes = await this.T.callAPI('post', '/api/v1/users/:id/do/modify', {
            params: { id: d.id },
            body  : { data: { isDisabled: true } },
            alert : { okMessage: this.$t('User disabled') },
          });
          break;

        case 'enable':
          apiRes = await this.T.callAPI('post', '/api/v1/users/:id/do/modify', {
            params: { id: d.id },
            body  : { data: { isDisabled: false } },
            alert : { okMessage: this.$t('User enabled') },
          });
          break;
      }
      if (!apiRes || !apiRes.ok) return;

      this.$store.commit('updateHighlightedTableDataId', d.id);

      await this.loadData();
    },
    openSetup(d, target) {
      let prevRouteQuery = this.T.packRouteQuery();

      switch(target) {
        case 'add':
          this.$router.push({
            name: 'user-add',
            query: prevRouteQuery,
          });
          break;

        case 'setup':
          this.$store.commit('updateHighlightedTableDataId', d.id);

          this.$router.push({
            name  : 'user-setup',
            params: {id: d.id},
            query : prevRouteQuery,
          });
          break;
      }
    },
  },
  computed: {
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
      },
    }
  },
}
</script>

<style scoped>
</style>
<style>
</style>
