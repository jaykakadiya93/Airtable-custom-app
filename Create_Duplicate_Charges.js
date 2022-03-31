// Change these to match your base.
let table = base.getTable('Orders');
let masterQuery1 = await table.selectRecordsAsync();
// When run from a button field, the script skips the prompt
// and automatically uses the button's record.
let record = await input.recordAsync('Choose a record', table);
let recordId_order = record.id
let recordId_last = record.getCellValue("Last Month Order")
var Charges
var price_book

for (let x of masterQuery1.records) {
    if(x.id === recordId_last[0].id){
        Charges = x.getCellValue("Charges")
    }
    
}

let table_price_book = base.getTable('Price Book');
let masterQuery_pricebook = await table_price_book.selectRecordsAsync();

for (let x of masterQuery_pricebook.records) {
    if(x.getCellValueAsString("Product Name") === "Weekly Hot Sheet - Monthly Fee"){
        price_book = x.id
    }
    
}

let table_charges = base.getTable("Charges");
let chargesQuery1 = await table_charges.selectRecordsAsync();
for(let y of Charges){
    for(let c of chargesQuery1.records){
        if(y.id === c.id) {
            if(c.getCellValueAsString("Charge Type") != "Initial Join Fee" && c.getCellValueAsString("Charge Type") != "Misc Fees"){
                if(c.getCellValue("Product")[0].name != "Call Analyzing - Set Up Fee"){
                    //console.log(c.getCellValueAsString("Product"))
                    if(c.getCellValue("Product")[0].name == "Weekly Hot Sheet - Free Monthly Fee"){
                        await table_charges.createRecordAsync({
                            "Order": [{id: recordId_order}],
                            "Charge Status": {name: "Awaiting Payment"},
                            "Charge Type": {name: c.getCellValueAsString("Charge Type")},
                            "Product": [{ id: price_book }],
                            "DM Add Ons": c.getCellValue("DM Add Ons"),
                            "Budget": c.getCellValue("Budget"),
                            "Market": c.getCellValue("Market"),
                            "Pull Hot Sheets": c.getCellValue("Pull Hot Sheets"),
                            "Audantic": c.getCellValue("Audantic")

                });

                    }else
                        await table_charges.createRecordAsync({
                            "Order": [{id: recordId_order}],
                            "Charge Status": {name: "Awaiting Payment"},
                            "Charge Type": {name: c.getCellValueAsString("Charge Type")},
                            "Product": c.getCellValue("Product"),
                            "DM Add Ons": c.getCellValue("DM Add Ons"),
                            "Budget": c.getCellValue("Budget"),
                            "Market": c.getCellValue("Market"),
                            "Pull Hot Sheets": c.getCellValue("Pull Hot Sheets"),
                            "Audantic": c.getCellValue("Audantic")

                });
                }
                        
            }

            
        }
        
    }
    
}
console.log("Charges are created")