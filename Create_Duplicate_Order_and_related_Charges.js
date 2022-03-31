// Change these to match your base.
let table = base.getTable('Orders');

// When run from a button field, the script skips the prompt
// and automatically uses the button's record.
let record = await input.recordAsync('Choose a record', table);
let recordId = record.id

var Order_Type = "MO";
var Order_status = "Budget Set";
var Member = record.getCellValue("Member");
var Production_Period = "";
var Last_Two_Month_Order= record.getCellValue("Last Month Order");

var split_1 = record.name.split(":");
var split_2 = String(split_1[1]).split(" ")
var month_3 = split_2[1]
var month =""
var year = split_2[2]
if (month_3 == "Jan"){
    month = "01"
}else if (month_3 == "Fab"){
    month = "02"
}else if (month_3 == "Mar"){
    month = "03"
}else if (month_3 == "Apr"){
    month = "04"
}else if (month_3 == "May"){
    month = "05"
}else if (month_3 == "Jun"){
    month = "06"
}else if (month_3 == "Jul"){
    month = "07"
}else if (month_3 == "Aug"){
    month = "08"
}else if (month_3 == "Sep"){
    month = "09"
}else if (month_3 == "Oct"){
    month = "1"
}else if (month_3 == "Nov"){
    month = "12"
}else if (month_3 == "Dec"){
    month = "01"
}

var date = year + "-" + month +  "-01"
var Production_Period_id
let table_time_periods = base.getTable('Time Periods');
let masterQuery1 = await table_time_periods.selectRecordsAsync();

for (let x of masterQuery1.records) {
    let next_date = x.getCellValueAsString("Production Period");
    if(String(date) === String(next_date)){
        Production_Period_id = x.id
    }
    
}

let recordId_order = await table.createRecordAsync({
    "Order Type": {name: Order_Type},
    "Order Status": {name: Order_status},
    "Member": Member,
    "Last Two Month Order": Last_Two_Month_Order,
    "Last Month Order": [{ id: record.id }],
    "Production Period":[{ id: Production_Period_id }]       
});

let table_price_book = base.getTable('Price Book');
let masterQuery_pricebook = await table_price_book.selectRecordsAsync();
var price_book
for (let x of masterQuery_pricebook.records) {
    if(x.getCellValueAsString("Product Name") === "Weekly Hot Sheet - Monthly Fee"){
        price_book = x.id
    }
    
}


var Charges = record.getCellValue("Charges")
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
console.log("Order and Charges are created")