import type { RouteLocation } from "vue-router"
import { entities } from "~~/constants/appRouteEntities"


export const isRouteValid = (route: RouteLocation) => {
    
    const {id, action, entity} = route.params as {id?: string, action: string, entity: string}

    if(!entities.includes(entity)){
        return false
    }

    switch(action){
        case 'update': return !!id && /^\d+$/.test(id as string)
        case 'create': return id === ''
        default: return action === undefined && id === undefined
    }

}