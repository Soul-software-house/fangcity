
export function getStrapiSerie(strapiResponse) {
  console.log('Strapi Serie Parser:', strapiResponse)
 
  return strapiResponse.map(item => {
    return {
      name: item.attributes.name,
      imageUrl: item.attributes.image.data.attributes.url
    }
})
}

export function getStrapiTraits(strapiResponse) {
  console.log('Strapi Triat Parser:', strapiResponse)
 
  return strapiResponse.map(item => {
    return {
      name: item.attributes.name,
      rarity: item.attributes.rarity,
      priceAWOO: item.attributes.priceAwoo, 
      priceETH: item.attributes.priceEth,
      noEar: item.attributes.noEar,
      // *** Change this in strapi to serie. 
      serie: item.attributes.series.data.attributes.name,
      requiredTraits: (item.attributes.requiredTraits.data || []).map(trait => trait.attributes.name),
      maxQuantity: item.attributes.maxQuantity,
      stock: item.attributes.stock,
      type: item.attributes.type,
      image: item.attributes.image.data.attributes.url,
      // idk wtf these are 
      inventory: false,
      link: '',
    }
})
}
