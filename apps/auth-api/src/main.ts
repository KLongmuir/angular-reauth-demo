import express from 'express';
const app = express()
const port = 3000

app.use((req, res, next) => {
  setTimeout(next, Math.floor(( Math.random() * 2000) + 100));
});

app.get('/content', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('TOKEN: ', token, req.headers.authorization);

  if (!token) {
    res.status(400).send('Bearer no authorization');
    return;
  }

  if (token === 'badToken') {
    res.status(401).send('you are not authenticated');
    return;
  }

  if (token === 'goodButBadToken') {
    res.status(403).send('you are not authorized');
    return;
  }

  res.status(200).send('hey it works');
  return;
});

app.get('/oauth/token', (req, res) => {
  if (req.query.id === 'refreshToken') {
    res.status(200).send('goodToken');
    return;
  } else if (req.query.id === 'badRefreshToken') {
    res.status(200).send('badToken');
    return;
  } else {
    res.status(200).send('goodButBadToken');
    return;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
