= Pausing Transform

A transform stream that will buffer data written until flushed. I'm using this hold
and transform my rendered output before it's written to the express response object
so that I can still add headers after rendering has started.

== Usage

The example below holds the data written until it is flushed (or `end()` is called)
and then transforms it to upper case. The transform function is optional.

```
let PausingTransform = require('pausing-transform')

let pausing = new PausingTransform((chunk) => chunk.toString().toUpperCase())
pausing.pipe(res)
pausing.write('something here')
pausing.end()

```


