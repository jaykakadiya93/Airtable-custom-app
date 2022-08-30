let inputConfig = input.config();

let response = await fetch("API URL", {
  headers: {
    "Content-Type": "application/json",
    "Authorization": "key"
  }
});
var objstr = JSON.stringify(await response.json());
var obj = JSON.parse(objstr);
//console.log(obj)
if(obj.project.owner != undefined){
console.log(obj.project.owner.fullName)
console.log(obj.project.owner.id)
output.set('fullName', obj.project.owner.fullName);
output.set('o_id', obj.project.owner.id);
}
