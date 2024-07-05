import https from 'node:https';

const keepAlive = () => {
  https.get('https://cashsense.vercel.app/api/healthcheck', (res) => {

    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  
    res.on('data', (d) => {
      console.log('data:', d.toString());
    });
  
  }).on('error', (e) => {
    console.error(e);
  }); 
}

keepAlive();
