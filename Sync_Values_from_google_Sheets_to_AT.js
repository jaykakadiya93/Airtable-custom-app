//define the client id
const C_ID = '';
//define the client secret
const C_S = '';
//define the refresh token
const R_T = '';



// requesting the access token
let res = await fetch("https://oauth2.googleapis.com/token?client_id="+C_ID+"&client_secret="+C_S+"&refresh_token="+R_T+"&grant_type=refresh_token",{
  method: 'POST',
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

//convert to json format
var objstr1 = JSON.stringify(await res.json());
//parse the json
var obj1 = JSON.parse(objstr1);



/**
* @param {string} SHEET_ID
* @param {number} rowIsSyncedCol
* @param {number} smplUIDCol
* @param {number} smplFastName
* @param {array} ValueCol
* @param {string} range
*/
async function updateIsSynchedGS(SHEET_ID, rowIsSyncedCol, smplUIDCol, smplFastName, ValueCol, range, gsName){

//console.log('inside')
  // getting the google sheet data using the access token from above step
let response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+SHEET_ID+"/values/"+range,{
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${obj1.access_token}`,
  }
});
// convert to json format
var objstr = JSON.stringify(await response.json());
//parse the json
var obj = JSON.parse(objstr);
//console.log(obj)


// define the Sample table
let table = base.getTable('Sample');
// define the view
//let view = table.getView('Not Synced with GS')
//let view = table.getView('Characterizations')
let ValueCol1 = ValueCol[0]
let ValueCol2 = ValueCol[1]
let ValueCol3 = ValueCol[2]
//select needed fields from the sample table
let masterQuery = await table.selectRecordsAsync({fields: [
        "Sample UID",
        "FastLabel",
        "Emissivity Value",
        "Emissivity St Dev",
        "Contact Angle Average [°]",
        "Contact Angle St.Dev [°]",
        "T PAR 0° (IS Ocean)",
        "T 0° 555 nm (IS Ocean)",
        "R_compression [mm]",
        "R_tension [mm]",
        "T PAR (EPFL)",
        "COS [%]",
        "COS SDev [%]",
        "COS Rep #",
        "Adhesion (ASTM D3359) [0-5]"
    ]});

//loop through the google sheet values
for(let y in obj.values){
  // check if the google sheet line was not synced (use A column)
  if(obj.values[y][rowIsSyncedCol] == "FALSE"){
    //loop through sample table
    for(let x of masterQuery.records){
      var entryFound = false;
      // cheking the google sheet value is not null or undefined
      //Comparing the sample UID
      if(obj.values[y][smplUIDCol] != undefined && obj.values[y][smplUIDCol] != ""){
        // if(x.name == obj.values[y][smplUIDCol].trim() || x.name.substr(0,6) == obj.values[y][smplUIDCol].trim()  ){
        if(x.name.toLowerCase().includes(obj.values[y][smplUIDCol].trim().toLowerCase())){ // || x.name.substr(0,6) == obj.values[y][smplUIDCol].trim()  ){
        entryFound = true;
        // update the values in AT
        if(gsName == "Emissivity"){
                await table.updateRecordAsync(x.id, {
                      "Emissivity Value" : Number(obj.values[y][ValueCol1]),
                      "Emissivity St Dev": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Contact"){
                await table.updateRecordAsync(x.id, {
                      "Contact Angle Average [°]" : Number(obj.values[y][ValueCol1]),
                      "Contact Angle St.Dev [°]": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Transmittance Spectra IS Ocean"){
                await table.updateRecordAsync(x.id, {
                      "T PAR 0° (IS Ocean)" : Number(obj.values[y][ValueCol1]),
                      "T 0° 555 nm (IS Ocean)": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Critical Bending Radius"){
                await table.updateRecordAsync(x.id, {
                      "R_compression [mm]" : Number(obj.values[y][ValueCol1]),
                      "R_tension [mm]": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Transmittance Spectra EPFL"){
                await table.updateRecordAsync(x.id, {
                      "T PAR (EPFL)" : Number(obj.values[y][ValueCol1])
                      });
              }
              if(gsName == "Fragmentation Test (COS)"){
                await table.updateRecordAsync(x.id, {
                      "COS [%]" : Number(obj.values[y][ValueCol1]),
                      "COS SDev [%]" : Number(obj.values[y][ValueCol2]),
                      "COS Rep #" : Number(obj.values[y][ValueCol3])
                      });
              }
              if(gsName == "Adhesion Test (ASTM D3359)"){
                await table.updateRecordAsync(x.id, {
                      "Adhesion (ASTM D3359) [0-5]" : Number(obj.values[y][ValueCol1])
                      });
              }
        // row number, add header line + 1 because 0 is first in AT.
        let NUM = Number(y)+2;
        // defining the range
        let range = "A"+NUM+":A"+NUM;
        //console.log(range);
        //update the sync column in google sheet
        await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+SHEET_ID+"/values:batchUpdate",{
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${obj1.access_token}`,
                            },
                  body: JSON.stringify({
                    "valueInputOption": "RAW",
                    "data": [
                          {
                            "range": range,
                            "values": [
                              [true]
                            ]
                          }
                    ]
                  })
          });
      }
      }
      // if not found, look at fastLabel. UID has priority over fastlabel.
      if(!entryFound){
        if(obj.values[y][smplFastName] != undefined && obj.values[y][smplFastName] != ""){
            //COmparing the sample UID
            if(x.getCellValueAsString("FastLabel") == obj.values[y][smplFastName].trim()){
              // update the values in AT based on the gs name
              if(gsName == "Emissivity"){
                await table.updateRecordAsync(x.id, {
                      "Emissivity Value" : Number(obj.values[y][ValueCol1]),
                      "Emissivity St Dev": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Contact"){
                await table.updateRecordAsync(x.id, {
                      "Contact Angle Average [°]" : Number(obj.values[y][ValueCol1]),
                      "Contact Angle St.Dev [°]": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Transmittance Spectra IS Ocean"){
                await table.updateRecordAsync(x.id, {
                      "T PAR 0° (IS Ocean)" : Number(obj.values[y][ValueCol1]),
                      "T 0° 555 nm (IS Ocean)": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Critical Bending Radius"){
                await table.updateRecordAsync(x.id, {
                      "R_compression [mm]" : Number(obj.values[y][ValueCol1]),
                      "R_tension [mm]": Number(obj.values[y][ValueCol2])
                      });
              }
              if(gsName == "Transmittance Spectra EPFL"){
                await table.updateRecordAsync(x.id, {
                      "T PAR (EPFL)" : Number(obj.values[y][ValueCol1])
                      });
              }
              if(gsName == "Fragmentation Test (COS)"){
                await table.updateRecordAsync(x.id, {
                      "COS [%]" : Number(obj.values[y][ValueCol1]),
                      "COS SDev [%]" : Number(obj.values[y][ValueCol2]),
                      "COS Rep #" : Number(obj.values[y][ValueCol3])
                      });
              }
              if(gsName == "Adhesion Test (ASTM D3359)"){
                await table.updateRecordAsync(x.id, {
                      "Adhesion (ASTM D3359) [0-5]" : Number(obj.values[y][ValueCol1])
                      });
              }
              let NUM = Number(y)+2;
              // defining the range
              let range = "A"+NUM+":A"+NUM;
              //console.log(range);
              //update the sync column in google sheet
              await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+SHEET_ID+"/values:batchUpdate",{
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${obj1.access_token}`,
                                  },
                        body: JSON.stringify({
                          "valueInputOption": "RAW",
                          "data": [
                                {
                                  "range": range,
                                  "values": [
                                    [true]
                                  ]
                                }
                          ]
                        })
                });
            }
        }
      }
    }
  }
}
};


await updateIsSynchedGS("id",0,1,2,[3,4],"A2:K3000","Emissivity")
