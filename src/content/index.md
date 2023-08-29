# ChURI

ChURI is a polyglot serializer, deserializer and validator supporting various data formats.

The data processing is based on data schemas. Schemas are written in TypeScript. ChURI compiles such schemas into
efficient code implementing serializers, deserializers, and validators for the data conforming to those schemas.

The main data format supported is URI Charge Notation, which is used to encode data included into URI. Such URI
is called Charged URI, or ChURI.

Other data formats supported out of the box:

- JSON
- `application/x-www-form-urlencoded` (URI query parameters)
- URL-encoded
- plain text

Some formats support _insets_ containing data in another formats. For example, the `application/x-www-form-urlencoded`
format allows query parameter values to be encoded as URL-encoded ones, as plain text, or as URI Charge. The choice
is made by data schema.
