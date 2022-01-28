const { exec } = require("child_process");

const runNode = exec('npm start');

//configurar output do terminal para utf-8
runNode.stdout.setEncoding("utf-8")
runNode.stderr.setEncoding("utf-8")

//eventos de logs do bot
runNode.stdout.on("data", (data) => {
  console.log(data.trim()) //console log do bot
})

runNode.stderr.on("data", (data) => {
  console.error(data.trim()) //console error do bot
})