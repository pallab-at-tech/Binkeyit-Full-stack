const validURLconvert = (name) =>{

    if(!name) return null

    const url = name?.toString()?.replaceAll(" ","-")?.replaceAll(",","-")?.replaceAll("&","-")
    return url;
}

export default validURLconvert