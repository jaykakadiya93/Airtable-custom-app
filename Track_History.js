let table = base.getTable("Members");
let inputConfig = input.config();

let history = inputConfig.status_history+"|"+inputConfig.status

let split = history.split("|")

await table.updateRecordAsync(inputConfig.record_id, {
                "Previous Member Status": split[split.length -2],
                "Previous Member Status History": history
                });