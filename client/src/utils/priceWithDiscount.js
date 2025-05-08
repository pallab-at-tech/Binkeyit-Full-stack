export const priceWithDiscount = (price , dis=1) =>{

    const discountAmount = Math.ceil((Number(price) * Number(dis))/100)
    const autualPrice = Number(price) - Number(discountAmount)
    return autualPrice
}