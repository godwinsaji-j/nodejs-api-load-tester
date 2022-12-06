const cluster = require('node:cluster');
const http = require('node:http');
const { mainModule } = require('node:process');
const numCPUs = require('node:os').cpus().length;
const process = require('node:process');
var processIdWorkerIdArray = {};

function main(){
try{
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.process.pid} started with workerId = ${worker.id}`);
    processIdWorkerIdArray[`${worker.process.pid}`]=`${worker.id}`;
    console.log("Currnet Org details: %j",processIdWorkerIdArray)
});
} else {
    console.log(`Worker ${process.pid} started`);
    process.exit(0);
}
}catch(err){
    console.log(err);
}
}
main();