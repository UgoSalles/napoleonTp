<script setup lang="ts" generic="T extends EntityInterface">
  import type {EntityInterface} from '~/types/entity'
  import type {ReadonlyHeaders} from '~/types/headers'
  import type {FetchError} from 'ofetch'
  import {
    defaultCreateItemFunction,
    defaultDeleteItemFunction,
    defaultEditItemFunction,
  } from '~/utils/appCrudTableDefaultFunctions'

  interface Props {
    title: string | null
    headers?: ReadonlyHeaders
    data: Array<T>
    loading: boolean
    createItemFunction?: Function
    editItemFunction?: Function
    deleteItemFunction?: Function
    erreur?: FetchError<any> | null
  }

  const props = withDefaults(defineProps<Props>(), {
    title: null,
    loading: false,
    erreur: null,
    createItemFunction: defaultCreateItemFunction,
    editItemFunction: defaultEditItemFunction,
    deleteItemFunction: defaultDeleteItemFunction,
  })

  const dialogDelete = ref(false)
  const dialogDeleteIsLoading = ref(false)
  const selectedItem = ref<T>()

  /**
   * Ouvre la confirmation de suppression pour l'élément spécifié.
   *
   * @param item - L'élément à supprimer.
   * @return void
   */
  const openDialogDelete = (item: T) => {
    dialogDelete.value = true
    selectedItem.value = item
  }

  /**
   * Gère la validation de la suppression.
   */
  const handleValidateDelete = async () => {
    dialogDeleteIsLoading.value = true
    await props.deleteItemFunction(selectedItem.value as T)
    dialogDeleteIsLoading.value = false
    dialogDelete.value = false
  }
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :loading="loading"
    class="elevation-1"
    loading-text="Donnees en cours de chargement..."
    
  >
  <template v-slot:no-data>
    <VAlert v-if="erreur" closable title="Alert" text="Erreur "> </VAlert>
    <VAlert v-else closable title="Alert" text="Aucun donnée"> </VAlert>
  </template>

    <template v-slot:top>
      <v-toolbar
        flat
        v-if="title"
      >
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
        <v-spacer />
        <v-btn
          color="primary"
          @click="createItemFunction"
          :disabled="loading"
        >
          Ajouter
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.image="{value}">
      <v-img
        :src="value"
        max-height="100"
        max-width="100"
      />
    </template>
    <template v-slot:item.thumbnail="{value}">
      <v-img
        :src="value"
        max-height="500"
        max-width="500"
      />
    </template>
    <template v-slot:item.actions="{item}">
      <v-icon
        size="small"
        class="me-2"
        @click="editItemFunction(item)"
        icon="mdi-pencil"
      />
      <v-icon
        size="small"
        @click="openDialogDelete(item)"
        icon="mdi-delete"
      />
    </template>
  </v-data-table>

  <app-crud-table-delete-dialog
    v-model="dialogDelete"
    :loading="dialogDeleteIsLoading"
    @validate="handleValidateDelete"
  />
</template>

<style scoped></style>
