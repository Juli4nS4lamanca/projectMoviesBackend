import jwt from 'jsonwebtoken';

const auth = (request, response, next) => {
  const token = request.header('Authorization');

  if (!token) {
    return response.status(401).send('Acceso denegado. No hay token');
  }

  const tokenLimpio = token.replace("Bearer ", "");


  try {
    const decodedToken = jwt.verify(tokenLimpio, process.env.SECRET);
    request.user = decodedToken
    next();
  } catch (ex) {
    response.status(400).send('Token no valido');
  }
};

export default auth;
