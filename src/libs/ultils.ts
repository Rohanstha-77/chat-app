import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs))
}

export const chatHrefConstructor=(id1: string, id2: string)=>{
    const sortedIds = [id1,id2].sort()
    // console.log("sortedids", sortedIds)
    // console.log(`${sortedIds[0]}--${sortedIds[1]}`)
    return `${sortedIds[0]}--${sortedIds[1]}`
}

export function toPusherKey(key: string) {
    return key.replace(/:/g, '__')
}