// define the Sample table
let table = base.getTable('Sample');
//select needed fields from the sample table
let masterQuery = await table.selectRecordsAsync({fields: [
        "Campaign Code (label)",
        "X digits IID",
        "FastLabel",
        "Parent",
        "Trans 1",
        "Trans 2",
        "Trans 3",
        "Trans 4",
        "Trans 5",
        "Trans 6",
        "Trans 7",
        "Trans 8",
        "Trans 9",
        "Trans 10",
        "Note (label)",
        "Sample Description",
        "Last Trans Date (label)"
    ]});
// define the sampleUID array
let sampleUID = [];
// define the fastlable array
let fastlable = [];
//define the result
let result = "";
// define the transaction array
let trans = [];
// define validation array
let validation =[];
// define Note array
let note =[];
//define sampleDescription array
let sampleDescription = [];

//loop through sample table
    for(let x of masterQuery.records){
      sampleUID.push(x.getCellValueAsString("Campaign Code (label)")+x.getCellValueAsString("X digits IID"))
      //ony add into array if fastlable is not null
      if(x.getCellValueAsString("FastLabel") != ""){
        fastlable.push(x.getCellValueAsString("FastLabel"))
      }
      if(x.getCellValueAsString("Note (label)") != ""){
        note.push(x.getCellValueAsString("Note (label)"))
      }
      if(x.getCellValueAsString("Sample Description") != ""){
        sampleDescription.push(x.getCellValueAsString("Sample Description"))
      }

    }
// find the duplicate of the samleUID
const toFindDuplicatesUID = sampleUID => sampleUID.filter((item, index) => sampleUID.indexOf(item) !== index)
const duplicateElementUID = toFindDuplicatesUID(sampleUID);

// find the duplicate of the fastlable
const toFindDuplicatesfastlable = fastlable => fastlable.filter((item, index) => fastlable.indexOf(item) !== index)
const duplicateElementfastlable = toFindDuplicatesfastlable(fastlable);

// find the duplicate of the Note
const toFindDuplicatesNote = note => note.filter((item, index) => note.indexOf(item) !== index)
const duplicateElementNote = toFindDuplicatesNote(note);

// find the duplicate of the sampleDescription
const toFindDuplicatessampleDescription = sampleDescription => sampleDescription.filter((item, index) => sampleDescription.indexOf(item) !== index)
const duplicateElementsampleDescription = toFindDuplicatessampleDescription(sampleDescription);

// checking the conditions
for(let x of masterQuery.records){
      if(duplicateElementUID.includes(x.getCellValueAsString("Campaign Code (label)")+x.getCellValueAsString("X digits IID"))){
        result = "Sample UID is not unique" + "\n\n"
        validation.push("Critical Error")
      }
      if(duplicateElementfastlable.includes(x.getCellValueAsString("FastLabel"))){
        result = result + "Fastlabel is not unique" + "\n\n"
        validation.push("Critical Error")
      }
      if(x.getCellValueAsString("Parent") == "" && x.getCellValueAsString("Campaign Code (label)") != "SU" && x.getCellValueAsString("Campaign Code (label)") != "ZZ" && x.getCellValueAsString("Campaign Code (label)") != "Z0"){
        result = result + "Parent field is empty" + "\n\n"
        validation.push("Critical Error")
      }
      trans.push(x.getCellValueAsString("Trans 1"));
      trans.push(x.getCellValueAsString("Trans 2"));
      trans.push(x.getCellValueAsString("Trans 3"));
      trans.push(x.getCellValueAsString("Trans 4"));
      trans.push(x.getCellValueAsString("Trans 5"));
      trans.push(x.getCellValueAsString("Trans 6"));
      trans.push(x.getCellValueAsString("Trans 7"));
      trans.push(x.getCellValueAsString("Trans 8"));
      trans.push(x.getCellValueAsString("Trans 9"));
      trans.push(x.getCellValueAsString("Trans 10"));
      let counter = 0;
      for(let y of trans){
        if(y == "" && trans[counter+1] != "" && trans[counter+1] != undefined){
            result = result + "Transformations are not in order" + "\n\n"
            validation.push("Critical Error")
        }
        counter = counter+1;
      }
      // remove all the null element from trans array
      let transnotnull = trans.filter(elements => {
        return (elements != null && elements !== undefined && elements !== "");
            });
      if(transnotnull.every( (val, i, arr) => val === arr[0] ) == true && transnotnull.length != 1){
        result = result + "Transformations are identical to another sample" + "\n\n"
        validation.push("Warning Error")
      }
      if(duplicateElementNote.includes(x.getCellValueAsString("Note (label)"))){
        result = result + "Note (lable) is identical to another sample" + "\n\n"
        validation.push("Warning Error")
      }
      if(duplicateElementsampleDescription.includes(x.getCellValueAsString("Sample Description"))){
        result = result + "Sample Description is identical to another sample" + "\n\n"
        validation.push("Warning Error")
      }
      if(x.getCellValueAsString("Last Trans Date (label)") == ""){
        result = result + "Last Trans Date (lable) is empty" + "\n\n"
        validation.push("Warning Error")
      }
      //if there is no warning or Error then change the validation
      if(validation.length == 0){
        await table.updateRecordAsync(x.id, {
                      "Validation": [{name: "Validated"}]
                      });
      }
      // updating the Error Text and validation
      if(validation.length != 0 && validation.includes("Critical Error") == true && validation.includes("Warning Error") == true){
        await table.updateRecordAsync(x.id, {
                      "Error Text": result,
                      "Validation": [{name: "Warning Error"},{name: "Critical Error"}]
                      });
      }else if(validation.length != 0 && validation.includes("Critical Error") == true){
        await table.updateRecordAsync(x.id, {
                      "Error Text": result,
                      "Validation": [{name: "Critical Error"}]
                      });
      }else if(validation.length != 0 && validation.includes("Warning Error") == true){
        await table.updateRecordAsync(x.id, {
                      "Error Text": result,
                      "Validation": [{name: "Warning Error"}]
                      });
      }



      //console.log();
      trans = [];
      result = "";
      validation=[];
    }


// define the Transformation protocol table
let tableTP = base.getTable('Transformations Protocol');
//select needed fields from the sample table
let masterQueryTP = await tableTP.selectRecordsAsync({fields: [
        "Type Code",
        "IID",
        "Description"
   ]});
//define transUID array
let transUID = [];
//define description array
let description = [];

//loop through protocol table
    for(let x of masterQueryTP.records){
      transUID.push(x.getCellValueAsString("Type Code")+x.getCellValueAsString("IID"))
      //ony add into array if fastlable is not null
      if(x.getCellValueAsString("Description") != ""){
        description.push(x.getCellValueAsString("Description"))
      }
    }
// find the duplicate of the tranUID
const toFindDuplicatesPUID = transUID => transUID.filter((item, index) => transUID.indexOf(item) !== index)
const duplicateElementPUID = toFindDuplicatesPUID(transUID);

// find the duplicate of the Description
const toFindDuplicatesdesc = description => description.filter((item, index) => description.indexOf(item) !== index)
const duplicateElementdesc = toFindDuplicatesdesc(description);

for(let x of masterQueryTP.records){
      if(duplicateElementPUID.includes(x.getCellValueAsString("Type Code")+x.getCellValueAsString("IID"))){
        result = result + "Trans Protocol UID is not unique" + "\n\n"
        validation.push("Critical Error")
      }
      if(duplicateElementdesc.includes(x.getCellValueAsString("Description"))){
        result = result + "Description is identical to another record" + "\n\n"
        validation.push("Warning Error")
      }
      //updating the validation if there is no error or warning
      if(validation.length == 0){
        await tableTP.updateRecordAsync(x.id, {
                      "Validation": [{name: "Validated"}]
                      });
      }
      //updating the Error text
       if(validation.length != 0 && validation.includes("Critical Error") == true && validation.includes("Warning Error") == true){
        await tableTP.updateRecordAsync(x.id, {
                      "Error Text": result,
                      "Validation": [{name: "Warning Error"},{name: "Critical Error"}]
                      });
      }else if(validation.length != 0 && validation.includes("Critical Error") == true){
        await tableTP.updateRecordAsync(x.id, {
                      "Error Text": result,
                      "Validation": [{name: "Critical Error"}]
                      });
      }else if(validation.length != 0 && validation.includes("Warning Error") == true){
        await tableTP.updateRecordAsync(x.id, {
                      "Error Text": result,
                      "Validation": [{name: "Warning Error"}]
                      });
      }
      //console.log(result)
      result="";
      validation=[];
}
