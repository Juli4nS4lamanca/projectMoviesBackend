import jwt from 'jsonwebtoken';

const auth = (request, response, next) => {
  const token = request.header('x-auth-token');

  if (!token) {
    return response.status(401).send('Acceso denegado. No hay token');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    request.user = decodedToken
    next();
  } catch (ex) {
    response.status(400).send('Token no valido');
  }
};

export default auth;
