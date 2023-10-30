module.exports = (template, product) => {
    let output = template.replace(/{%productname%}/g, product.productName);
    output = output.replace(/{%productimage%}/g, product.image);
    output = output.replace(/{%productprice%}/g, product.price);
    output = output.replace(/{%productcountry%}/g, product.from);
    output = output.replace(/{%productnutrients%}/g, product.nutrients);
    output = output.replace(/{%productquantity%}/g, product.quantity);
    output = output.replace(/{%productdescription%}/g, product.description);
    output = output.replace(/{%productid%}/g, product.id);
    
    if (!product.organic) output = output.replace(/{%notorganic%}/g, 'not-organic');
    return output;  
}