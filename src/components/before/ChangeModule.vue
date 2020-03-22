<template>
  <div class="changeModule">
    <div
      v-for="(item, index) of moduleList"
      :key="index"
      @click="chose(item.id)"
      :class="currentModuleIndex == item.id ? 'current item' : 'item'"
    >{{item.name}}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "Vuex";
export default {
  data() {
    return {};
  },
  props: {
    close: Function
  },
  computed: {
    ...mapGetters(["moduleList", "currentModuleIndex"])
  },
  methods: {
    ...mapActions(["setCurrentModuleIndexAsync"]),
    chose(id) {
      this.setCurrentModuleIndexAsync(id);
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  background: $backC;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
}
.current {
  background: $brandC;
  color: #fff;
}
</style>