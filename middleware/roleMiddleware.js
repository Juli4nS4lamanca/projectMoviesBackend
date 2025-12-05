const authRole = requiredRole => (request, response, next) => {
  if (!request.user || !request.user.rol) {
    return response.status(403).send('Acceso denegado');
  };

  const hasRequiredRole = requiredRole.some(role => request.user.rol.includes(role));
  if (!hasRequiredRole) {
    return response.status(403).send('Acceso denegado');
  };
  next();
}

export default authRole;
