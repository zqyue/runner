<template>
  <div class="home">
    <section class="top">{{score}}</section>

    <section class="content">
      <input type="text" placeholder="姓" v-model="params.surname"/>

      <input type="text" placeholder="名" v-model="params.name"/>

      <div class="button" @click.stop="search">{{isSearch?'查询中...':'查询'}}</div>

      <ul v-if="resultList">
        <div style="text-align: left;border-bottom: none;margin-bottom: 10px">{{resultList.length?'查询到以下结果，请选择：':'暂无查询结果'}}</div>
        <li v-for="item in resultList"  @click.stop="getScore(item.url)">
          <span style="margin-right: 20px">{{item.title}}</span>
          <span>{{item.info}}</span>
        </li>
      </ul>

    </section>

  </div>
</template>

<script >
  // @ is an alias to /src
  // import HelloWorld from '@/components/HelloWorld.vue'
  import {fetch, getScore} from "../js/request";
  import Cheerio from 'cheerio'

  function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
  }

  export default {
    name: 'home',
    components: {
      // HelloWorld
    },
    data() {
      return {
        params: {
          surname: '',
          name: ''
        },
        isSearch: false,
        resultList:null,
        score: null
      }
    },
    methods: {
      getScore(url){
        let params={
          infoUrl:'https://itra.run'+url
        }
        this.isSearch=true
        getScore(params).end((err,res)=>{
          this.isSearch=false

          if (err) {
            alert('数据获取失败')
            return
          }
          this.score = res.text

        })

      },
      search() {
        if (!this.params.surname || !this.params.name) {
          alert('请补全参数')
          return
        }
        this.score=null
        this.isSearch = true
        this.resultList=null
        fetch(this.params).end((err, res) => {
          this.isSearch=false
          if (err) {
            alert('数据获取失败')
            return
          }
          let data = JSON.parse(res.text)
          console.log(data)
          this.isSearch=false
          if (getType(data) === 'Number') {
            this.score = data
          } else if (getType(data) === 'Array') {
            this.resultList = data
          } else {

          }


          // console.log(res.text)
        })

      }

    }
  }
</script>
<style scoped>

  .top {
    background-color: rgba(111, 164, 36, .8);
    height: 300px;
    color: white;
    text-align: center;
    line-height: 300px;
    font-size: 1rem;
  }
  .content{
    padding: 0 .6rem;
  }

  input {
    width: 100%;
    display: block;
    border: 1px solid rgb(220, 220, 220);
    outline: none;
    height: .65rem;
    line-height: .65rem;
    /*width: 5rem;*/
    margin: .5rem auto;
    display: block;
    padding-left: .3rem;
    /*lin*/
  }

  .button {
    height: .65rem;
    line-height: .65rem;
    /*width: 5rem;*/
    display: block;
    background-color: rgb(111, 164, 36);
    color: white;
    margin: 0 auto;
    text-align: center;
    font-weight: bold;

  }
  ul{
    text-align: center;
    margin-top: 30px;
  }

  li{
    border-bottom: 1px solid rgb(220,220,220);
    display: block;
    text-align: left;
    padding-left: 10px;
    /*display: flex;*/
    /*justify-content: space-between;*/

  }


</style>
