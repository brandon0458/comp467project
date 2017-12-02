interface AppConfig {
    redirectUri: string;
    clientID: string;
    serverURL: string;
  }
  
  // default: client(local) + server(production)
     let mode: string = 'default';

  // opt1: client(local) + server(local)
     //let mode: string = 'opt1';

  // opt2: client(production) + server(production)
     //let mode: string = 'opt2';



  let cI: string;
  let uri: string;
  let server: string;
  switch(mode) {
    case 'opt1': { 
        console.log("opt1");
         cI = 'aIeu8NVeP6e0AQpSA7CjuI2yGOnxGwq5';
         uri = 'http://localhost:4200/';
         server = 'http://localhost:9045';
        break; 
     } 
     case 'opt2': { 
        console.log("opt2"); 
        cI = 'jyWECyB1KnNg3zjOK5S4BKf3ysv6qhBK';
        uri = 'http://ec2-54-67-71-116.us-west-1.compute.amazonaws.com/';
        server = 'http://ec2-54-219-167-253.us-west-1.compute.amazonaws.com:9045';
        break; 
     } 
     default: { 
        console.log("default");
        cI = 'aIeu8NVeP6e0AQpSA7CjuI2yGOnxGwq5';
        uri = 'http://localhost:4200/';
        server = 'http://ec2-54-219-167-253.us-west-1.compute.amazonaws.com:9045';
        break; 
     } 
    } 
  
  export const APP_CONFIG: AppConfig = {clientID: cI,redirectUri: uri,serverURL: server};
  