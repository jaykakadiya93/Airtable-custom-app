let capacity = base.getTable('Capacity');
let cap_q = await capacity.selectRecordsAsync({fields: [
        "Link to Employees"
    ]});

let emp = base.getTable("Employees");
let emp_view = emp.getView("All Active Employees");
let emp_q = await emp_view.selectRecordsAsync({fields: [
        "Employee Name"
    ]});
var values =[];
var result;
for (let y of cap_q.records){
  let employee_array = y.getCellValue("Link to Employees");
  console.log(y.name)
  console.log(employee_array);
  for (let x of employee_array){
    let filteredRecords = emp_q.records.filter(a => {
                        return a.getCellValueAsString("Employee Name").includes(x.name)});
    if (filteredRecords.length == 1){
      values.push(x.id)   
    };


  };
  var keys = ["id"]

        result = employee_array.filter(function(e){
        return keys.every(function(a){
          return values.includes(e[a])
        })
      })
  await capacity.updateRecordAsync(y.id, {
               "Link to Employees": result
           });
  
  };