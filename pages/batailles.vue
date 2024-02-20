<script setup lang="ts">
    import { Methods } from "~/constants/httpMethod.const";
import type { BatailleInterface } from "~/types/bataille";
    const {data, pending, error } = useFetch<Array<BatailleInterface>>('/api/bataille', {
        default : () => [] as Array<BatailleInterface>,
    })

    type ListIcon = 'mdi-eye-arrow-left-outline' | 'mdi-eye-arrow-left'
    
    const icons = defineModel<ListIcon>({required: true})

    const passage = () => {
        icons.value = icons.value === 'mdi-eye-arrow-left-outline' ? 'mdi-eye-arrow-left' : 'mdi-eye-arrow-left-outline'
    }
    const icon = computed(() =>
        icons.value === 'mdi-eye-arrow-left-outline' ? 'mdi-eye-arrow-left' : 'mdi-eye-arrow-left-outline',
    )

    onMounted(() => {
        retrieveSheetText()
    })
  
    



    function retrieveSheetText() {
        let sheet = document.getElementById('sheet')
        if(sheet !== null){
            sheet.textContent = sheet.textContent?.substring(0, 300)+'...';
            
        }
    }



    function handleClick(){
        let sheet = document.getElementById('sheet')
        let situation = document.getElementById('situation')
        let sit = document.getElementById('sit')

        if(sheet !== null){
            sheet.textContent  = sheet.textContent?.slice(0, 900)+'...';
            sit?.classList.toggle('situation')
            situation?.classList.toggle('situation')
            
        }
    }
 


</script>

<template>
    
  <v-container class="container" v-for="bataille in data" :key="bataille.id" >

    <VRow cols="12" sm="4" class="mainContainer" v-if="bataille.victoire" >
        <VSheet class="entete" >
            <VLabel class="titre" :text="bataille.nom + ' - ' + bataille.annee"></VLabel>
            <VImg :src="'data:image/png;base64,'+ bataille.image" class="img" />
        </VSheet>

        <VSheet class="contenu" id="sheet" >
            <label>Date et lieu</label>
            <label class="text">{{bataille.lieu}}</label>
            <label>Forces en présence</label>
            <label class="text">{{bataille.force}}</label>
            <label>Pertes</label>
            <label class="text"> {{ bataille.pertes }}</label>

            <label class="situation" id="sit">Situation générale</label>
            <label class="text situation" id="situation" >{{bataille.situation}}</label>
        </VSheet>
    
         
        <VSheet class="button" >
            <VBtn  @click="handleClick()" @mouseover="passage()" @mouseout="passage()" :icon="icon" />
        </VSheet>

        
    </VRow>
  </v-container>
  
</template>

<style scoped>

.img {
    height: 200px;
    width: 300px;
    margin-bottom: 3%;
}

.container{
    width: 120%;
   
}

.mainContainer {
    display: flex;
    flex-direction: row;
    border: 1px solid #000;
    width: 100%;
    margin-bottom: 0.1%;
    padding: 1px;
}

.entete {
    display: flex;
    flex-direction: column;
    width: 20%;
    justify-content: center;
    align-items: center;
}

.contenu {
    display: flex;
    width: 73%;
    flex-direction: column;
    border: 1px solid #000;
    padding-top: 20px;
    font-family:Arial, Helvetica, sans-serif;
    font-size:12;
    
}

.button{
    display: flex;
   
    width: 3%;
}

.situation{
    display: none;
}

.text{
    margin-left: 30px;
}

.titre{
    margin-top: 2%;
    font-weight: bold;
    color: black;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 150%;
    
}


</style>