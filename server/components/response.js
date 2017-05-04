
export default function response (res, entity) {

  let typeResponse ={
    '200': 'SUCCESS',
    '201': 'CREATED',
    '400': 'BAD_REQUEST',
    '401': 'UNAUTHORIZED',
    '403': 'FORBIDDEN',
    '404': 'NOT_FOUND',
    '422': 'UNPROCESSABLE_ENTITY',
    '500': 'SERVER_ERROR',
    '204': 'DELETED'
  };

  return (response) =>{
    switch (String(response.statusCode)){
      case '201':
      case '204':
      case '200':
        res.status(response.statusCode).json({data: response.data, message: response.message, name: entity, type: typeResponse[response.statusCode]});
        break;
      case '500':
      case '422':
      case '400':
      case '401':
      case '403':
      case '404':
        res.status(response.statusCode).json({message: response.message, name: entity, type: typeResponse[response.statusCode]});
        break;
    }
  };
};
