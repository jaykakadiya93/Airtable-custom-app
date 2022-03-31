// Change these to match your base.
let table = base.getTable('Orders');

// When run from a button field, the script skips the prompt
// and automatically uses the button's record.
let record = await input.recordAsync('Choose a record', table);
let recordId = record.id

await table.updateRecordAsync(recordId, {
    "Budget Form" : null
})
var BudgetMarket = record.getCellValue("BudgetMarket");
var BudgetProduct = record.getCellValue("BudgetProduct");
var BudgetAddOn = record.getCellValue("BudgetAddOn");
var BudgetCharge = record.getCellValue("BudgetCharge");

var Credit_Type = record.getCellValue("Credit_Type");
var Referred_Member_Name = record.getCellValue("Referred_Member_Name");
var Net_Credit = record.getCellValue("Net_Credit");


async function myFunction(field, update_field) {
    var BM_R = ''
    var arrayLength = field.length;
    // console.log(field)
    for (var i = 0; i < arrayLength; i++) {
        if(update_field == "BudgetMarket_rt" || update_field == "BudgetProduct_rt" || update_field == "BudgetAddOn_rt" || update_field == "Referred_Member_Name_rt" ){
            BM_R = BM_R + field[i].name + "\n\n"
        }
        if(update_field == "Credit_Type_rt"){
            BM_R = BM_R + field[i] + ":\n\n"
        }
        if(update_field == "BudgetCharge_rt" || update_field == "Net_Credit_rt"){
            if(String(field[i]).includes(".")){
                BM_R = BM_R + "$" + field[i] + "\n\n"
            }else{
                BM_R = BM_R + "$" + field[i] + ".00" + "\n\n"
            }
                
        }
}

await table.updateRecordAsync(recordId, {
    [update_field] : BM_R
})
}

if(BudgetMarket != null){
myFunction(BudgetMarket,"BudgetMarket_rt")
}

if(BudgetProduct != null){
myFunction(BudgetProduct,"BudgetProduct_rt")
}

if(BudgetAddOn != null){
myFunction(BudgetAddOn,"BudgetAddOn_rt")
}

if(BudgetCharge != null){
myFunction(BudgetCharge,"BudgetCharge_rt")
}


if(Credit_Type != null){
myFunction(Credit_Type,"Credit_Type_rt")
}

if(Referred_Member_Name != null){
myFunction(Referred_Member_Name,"Referred_Member_Name_rt")
}

if(Net_Credit != null){
myFunction(Net_Credit,"Net_Credit_rt")
}

console.log("Rich Text has been created")