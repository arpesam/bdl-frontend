<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col justify-center>
        <img id="page1" class="pbm-img" src="../assets/pmb-img-00001.png" alt="" srcset="../assets/pmb-img-00001.png" />
        <hr class="spacer">
        <img id="page2" class="pbm-img"  src="../assets/pmb-img-00002.png" alt="" srcset="../assets/pmb-img-00002.png" />
        <hr class="spacer">
        <img id="page3" class="pbm-img"  src="../assets/pmb-img-00003.png" alt="" srcset="../assets/pmb-img-00003.png" />
        <hr class="spacer">
        <img id="page4" class="pbm-img"  src="../assets/pmb-img-00004.png" alt="" srcset="../assets/pmb-img-00004.png" />
        <hr class="spacer">
        <img id="page5" class="pbm-img"  src="../assets/pmb-img-00005.png" alt="" srcset="../assets/pmb-img-00005.png" />
        <hr class="spacer">
        <img id="page6" class="pbm-img"  src="../assets/pmb-img-00006.png" alt="" srcset="../assets/pmb-img-00006.png" />
        <hr class="spacer">
        <img id="page7" class="pbm-img"  src="../assets/pmb-img-00007.png" alt="" srcset="../assets/pmb-img-00007.png" />
        <hr class="spacer">
        <img id="page8" class="pbm-img"  src="../assets/pmb-img-00008.png" alt="" srcset="../assets/pmb-img-00008.png" />
        <hr class="spacer">
        <img id="page9" class="pbm-img"  src="../assets/pmb-img-00009.png" alt="" srcset="../assets/pmb-img-00009.png" />
        <hr class="spacer">
        <img id="page10" class="pbm-img"  src="../assets/pmb-img-000010.png" alt="" srcset="../assets/pmb-img-000010.png" />
        <hr class="spacer">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
data() {
  return {
    setDetails: true,
    APIbasePath: import.meta.env.VITE_API_URL,
    logoutDropdown: false,
    menu: 'fa-list',
    password: '',
    patients: [],
    loading: false,
    successAlert: '',
    warningAlert: '',
    snackbar: false,
    snackBarText: '',
    snackbarColor: 'green'
  }
},
methods: {

},
}
</script>

<style scoped>
.container {
color: #3d3d3d;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.pbm-img {
width: 500px;
display: block;
margin-bottom: 10px;
}

@media (max-width: 600px) {
  .pbm-img {
    width: 100%;
  }
}

.spacer {
  margin: 10px 0 10px 0;
width: 500px;

}

.empty-message {
text-align: center;
margin: 100px;
}

html {
  scroll-behavior: smooth;
}
</style>
