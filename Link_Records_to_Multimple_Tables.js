// define the client order table
let table_CO = base.getTable("Client orders");
// define the ew Orders view
let view_CO = table_CO.getView("New Orders");
// select the needed column from the view
let COQuery = await view_CO.selectRecordsAsync({fields: [
        "Numer zamówienia"
    ]});
//define the products table
let table_PO = base.getTable("Products");
//define the products to order view
let view_PO = table_PO.getView("Products to order");
//select needed column from the view
let POQuery = await view_PO.selectRecordsAsync({fields: [
        "Client Order",
        "Orders to company",
        "Company"
    ]});
//define the orders to companies table
let table_OC = base.getTable("Orders to Companies");
//define the firma table
let table_firma = base.getTable("Firma");
//select the needed columnn form the table
let FQuery = await table_firma.selectRecordsAsync({fields: [
        "Name"
    ]});
// start loop through the cliet orders table
for(let y of COQuery.records){
    //assign the array 
    var company =[];
    //filter the order based on the order name
    let filteredRecords = POQuery.records.filter(x => {
                        return x.getCellValueAsString("Client Order").includes(y.name)});
    //add the all the company to the array
    for (let a of filteredRecords){
        company.push(a.getCellValueAsString("Company"))
        
    }
    // get unique list of the company
    const uniqueCompany = company.filter((x, i, a) => a.indexOf(x) == i)
    // loop through all the unnique company
    for (let b of uniqueCompany){
        //get the comapny id from the firma table
        let firma_id = FQuery.records.filter(z => {
                        return z.getCellValueAsString("Name").includes(b)});
        // create the record in Orders to companies
        let recordId_order_company = await table_OC.createRecordAsync({
                "Firma": firma_id,       
                });
        // loop through all the products
        for(let c of POQuery.records){
            // checking condition on client order name and comapany name
            if(c.getCellValueAsString("Client Order") == y.name && c.getCellValueAsString("Company") == b){
                //assiged the Orders to COmpanies to the product
                await table_PO.updateRecordAsync(c.id, {
               "Orders to company": [{id: recordId_order_company}]
           });
            }

        }

    }
    //set the checkbox to Yes
    await table_CO.updateRecordAsync(y.id, {
               "Generated orders to companies": true });
}
