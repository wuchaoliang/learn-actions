<template>
  <div class="home">
    <button @click="onError1">sentry1</button>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  created() {
    this.$http.get("/api/getArticle/1");
  },
  methods:{
    onError1(){
      console.log(window["aaa"].bbb);
    }
  }
};
</script>
