export function getHistoric(): string[]{
    const historic = localStorage.getItem('historic')

    if (historic) {
        return  JSON.parse(historic)
    }

    return []
}

export function setHistoric(item: string){
    const historic = localStorage.getItem('historic')

    if (historic) {
        const parse = JSON.parse(historic)
        localStorage.setItem('historic', JSON.stringify([...parse, item]))
        return
    }

    localStorage.setItem('historic', JSON.stringify([item]))
}