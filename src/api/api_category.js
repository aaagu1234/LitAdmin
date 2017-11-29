/**
 * Created by jerry on 2017/11/13.
 * 图书相关api
 */
import * as API from './'

export default {

  //查询获取book列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/category', params)
  },
  add: params => {
    return API.POST(`/api/v1/category`, params)
  },
  update: (id, params) => {
    return API.PUT(`/api/v1/category/${id}`, params)
  },
}
