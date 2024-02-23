<script setup lang="ts">
    import { Methods } from "~/constants/httpMethod.const";
import type { BatailleInterface } from "~/types/bataille";
    const {data, pending, error } = useFetch<Array<BatailleInterface>>('/api/bataille', {
        default : () => [] as Array<BatailleInterface>,
    })

    type ListIcon = 'mdi-eye-arrow-left-outline' | 'mdi-eye-arrow-left'
    
    const icons = defineModel<ListIcon>({required: true})

    const passage = (batailleId: number) => {
        icons.value = icons.value === 'mdi-eye-arrow-left-outline' ? 'mdi-eye-arrow-left' : 'mdi-eye-arrow-left-outline'
    }
    const icon = computed(() =>
        icons.value === 'mdi-eye-arrow-left-outline' ? 'mdi-eye-arrow-left' : 'mdi-eye-arrow-left-outline',
    )

    onMounted(() => {
        //pour chaque bataille, calculer la longueur de la description et la couper si elle est trop longue
        data.value.forEach((bataille) => {
            cutDescription(bataille.id)
        })

    })
    
   
    



   


    // Référence pour stocker les descriptions des batailles
    const descriptions = ref([] as { id: number; description: string }[]);



    // couper la description a 300 caractère
    const cutDescription = (batailleId: number) => {
        const longDescription = data.value.find((item) => item.id === batailleId);
        const lieu  = longDescription?.lieu.length
        const force = longDescription?.force.length
        const pertes = longDescription?.pertes.length
        const totalLength = lieu! + force! + pertes!;

        if (totalLength > 300) {
            // Calculer le nombre de caractères à retirer de chaque attribut
            const reductionFactor = 300 / totalLength;
            const newLieuLength = Math.floor(lieu! * reductionFactor);
            const newForceLength = Math.floor(force! * reductionFactor);
            const newPertesLength = Math.floor(pertes! * reductionFactor);

            // Réduire la longueur de chaque attribut en conséquence
            const shortenedLieu = longDescription!.lieu.substring(0, newLieuLength);
            const shortenedForce = longDescription!.force.substring(0, newForceLength);
            const shortenedPertes = longDescription!.pertes.substring(0, newPertesLength);

            // Construction de la nouvelle description
            const shortenedDescription = `${shortenedLieu} ${shortenedForce} ${shortenedPertes}`;

            // Mise à jour de l'élément HTML avec la nouvelle description
            let sheet = document.getElementById('sheet');
            if (sheet) {
                sheet.textContent = shortenedDescription;
            }
        }
        
        
    }






    // Référence pour stocker les descriptions étendues des batailles
    const expandedDescriptions = ref([] as { id: number; elements: string[] }[]);

    // Fonction pour vérifier si une description spécifique est étendue pour une bataille donnée
    const isDescriptionExpanded = (batailleId: number, element: string) => {
    const expanded = expandedDescriptions.value.find((item) => item.id === batailleId);
    return expanded ? expanded.elements.includes(element) : false;
    };

    const handleClick = (batailleId: number) => {
        const index = expandedDescriptions.value.findIndex((item) => item.id === batailleId);

        if (index !== -1) {
            // La bataille a déjà des détails étendus, donc les supprimer
            expandedDescriptions.value.splice(index, 1);
        } else {
            // La bataille n'a pas de détails étendus, réinitialiser les autres à leur état initial
            expandedDescriptions.value = [];
            // Ajouter les nouveaux détails
            expandedDescriptions.value.push({ id: batailleId, elements: ['lieu', 'force', 'pertes', 'situation'] });
        }
    };
 


</script>

<template>
    
  <v-container class="container" v-for="bataille in data" :key="bataille.id" >

    <VRow cols="12" sm="4" class="mainContainer" v-if="bataille.victoire"  >
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

            <p v-if="isDescriptionExpanded(bataille.id, 'situation')" >Situation générale</p>
            <p class="text" v-if="isDescriptionExpanded(bataille.id, 'situation')" >{{bataille.situation}}</p>
        </VSheet>
    
         
        <VSheet class="button" >
            <VBtn  @click="handleClick(bataille.id)" @mouseover="passage(bataille.id)" @mouseout="passage(bataille.id)" :icon="icon" />
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