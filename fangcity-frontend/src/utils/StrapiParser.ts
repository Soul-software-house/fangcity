
export function getStrapiSerie(strapiResponse) {
  console.log('Strapi Parser:', strapiResponse)
 
  return strapiResponse.map(item => {
    return {
      name: item.attributes.name,
      imageUrl: item.attributes.image.data.attributes.url
    }
})
}
