const errors = {
    productNotFound: {
      message: 'El producto no existe',
      statusCode: 404
    },
    productAlreadyExists: {
      message: 'El producto ya existe',
      statusCode: 400
    },
    invalidProductData: {
      message: 'Los datos del producto son inválidos',
      statusCode: 400
    }
  };
  
  function handleError(err, req, res, next) {
    const error = errors[err.type] || {
      message: 'Ocurrió un error inesperado',
      statusCode: 500
    };
    console.error(err);
    res.status(error.statusCode).json({ error: error.message });
  }
  
  module.exports = { errors, handleError };
  