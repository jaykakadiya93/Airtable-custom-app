let table = base.getTable("Charges");
let view = table.getView("Data Tech Market View Market Change");
let view1 = table.getView("Data Tech Market View");
let chargesQuery1 = await view.selectRecordsAsync({fields: [
        "Market-Month"
    ]});

let chargesQuery = await view1.selectRecordsAsync({fields: [
        "Market-Month"
    ]});

let table_mm = base.getTable("Market-Month");
let mmQuery1 = await table_mm.selectRecordsAsync({fields: [
        "Market - Month"
    ]});


for(let y of chargesQuery1.records){
    let filteredRecords_mm = mmQuery1.records.filter(x => {
        return x.name.includes(y.getCellValueAsString("Market-Month"))});
    if(filteredRecords_mm[0] != null){
        //console.log(filteredRecords_mm)
        let filteredRecords = chargesQuery.records.filter(y => {
                        return y.getCellValueAsString("Market-Month").includes(filteredRecords_mm[0].name)});
        var array_of_id
        array_of_id= filteredRecords.map(record => ({id: record.id}));
       await table_mm.updateRecordAsync(filteredRecords_mm[0].id, {
               "Charges": array_of_id
           });

     }else{
        await table_mm.createRecordAsync({
                           "Charges": [{id: y.id}],
                           "Market - Month": y.getCellValueAsString("Market-Month")

               });
    }
    
}