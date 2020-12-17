Contexto:

El servicio simplemente recibe un mensaje (string) y valida si el mismo es una keyword (o sinónimo) guardada en una base de datos no relacional y provee un flag (boolean) como respuesta JSON.

EJERCICIO:

* Refactorizar el servicio.
  - Cosas a tener en cuenta:
    * Usar modo estricto
    * Hacer el código más legible y eficiente
    * Agregar testing unitario (3/5 casos)
    * Idealmente pensar la estructura del proyecto teniendo en cuenta controllers y services
    * PLUS: Se provee un ejemplo de la estructura de datos de la DB que puede servir como stub para pruebas de integración.


Ejemplo de uso:

curl -v localhost:9090/keyword-parser -H 'Content-type: application/json' -d '{
      "payload": "hola",
      "pais": "AR"
}'



