<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.entName" clearable class="filter-item" style="width: 200px;" placeholder="请输入企业名"/>
      <el-input v-model="listQuery.realname" clearable class="filter-item" style="width: 200px;" placeholder="请输入联系人名"/>
      <el-select v-model="listQuery.sysRelease" clearable class="filter-item" placeholder="请选择">
        <el-option value="synsea" label="synsea版"/>
        <el-option value="standard" label="标准版"/>
        <el-option value="enterprise" label="企业版"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="企业名" width="95">
        <template slot-scope="scope">
          {{ scope.row.entName }}
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column label="系统版本" align="center">
        <template slot-scope="scope">
          {{ scope.row.sysRelease | sysReleaseFilter }}
        </template>
      </el-table-column>
      <el-table-column label="系统激活时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="总登录次数" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalLoginCount || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="文件数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalFileCount || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="文件总大小" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalFileSize || 0 }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.offset" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
    import { entStatList } from '@/api/ent'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

    export default {
      name: "list",
      components: { Pagination },
      filters: {
        statusFilter(status) {
          const statusMap = {
            published: 'success',
            draft: 'gray',
            deleted: 'danger'
          }
          return statusMap[status]
        },
        sysReleaseFilter(sysRelease){
          const sysReleaseMap = {
            synsea: 'synsea版',
            standard: '标准版',
            enterprise: '企业版'
          }
          return sysReleaseMap[sysRelease] || sysReleaseMap.standard
        }
      },
      data() {
        return {
          listQuery: {
            entName: undefined,
            realname: undefined,
            sysRelease: undefined,
            limit: 20,
            offset: 1
          },
          list: null,
          listLoading: true,
          total: 0
        }
      },
      created() {
        this.fetchData()
      },
      methods: {
        fetchData() {
          this.listLoading = true
          entStatList(this.listQuery).then(response => {
            this.list = response.data.list
            this.total = response.data.total
            this.listLoading = false
          })
        },
        handleFilter(){
          this.listQuery.offset = 1;
          this.fetchData()
        }
      }
    }
</script>

<style scoped>

</style>
