const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let appdata = [
  { id: 1, task: "buy groceries", priority: "medium", created: Date.now() },
  { id: 2, task: "finish homework", priority: "high", created: Date.now() },
  { id: 3, task: "do the laundry", priority: "low", created: Date.now() },
]

let nextID = 3;

const addDerivedFields = function (item) {
  const daysbypriority = {high: 1, medium: 3, low: 7};
  const daysToAdd = daysbypriority[item.priority] || 3;
  const deadline = item.created + daysToAdd * 24 * 60 * 60 * 1000;
  return {...item, deadline};
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {

  if ( request.url === '/api/todos' ) {
    response.writeHead( 200, {'Content-Type': 'application/json'} );
    response.end( JSON.stringify(appdata));
    return
  }


  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
      const body = JSON.parse( dataString )
    // ... do something with the data here!!!
    if(request.url === '/add' ) {
      const newTodo = {
        id: nextID++,
        task: body.task,
        priority: body.priority,
        created: Date.now()
      }
      appdata.push(addDerivedFields(newTodo));
    }
    else if( request.url === '/delete' ) {
      appdata = appdata.filter( item => item.id !== body.id );
    }
    else if ( request.url === '/update' ) {
      appdata = appdata.map(function (item) {
        if(item.id === body.id) {
          const updated = {...item, task: body.task, priority: body.priority};
          return addDerivedFields(updated);
        }
        return item;
      })
    }

    response.writeHead( 200, {'Content-Type': 'application/json' } );

    // change this to incorporate data
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {
     // if the error = null, then we've loaded the file successfully
     if( err === null ) {
       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )
     }else{
       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )
     }
   })
}
server.listen( process.env.PORT || port )
