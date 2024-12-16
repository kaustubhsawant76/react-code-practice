import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'

import App from './App.jsx'

function MyApp() {
  return(
    <div>
      <h1>Custom App !!!</h1>
    </div>
  )
}


//JSX is parsed into following format
//the below code is not working the problem is with the syntax follow anothjerElement syntac
// const ReactElement = {
//   type:'a',
//   props: {
//       href:'https://google.com',
//       target:'_blank'
//   },
//   children:'Click me to visit google'
//   }

const reactElement = React.createElement(
  'a',
  {href: 'https:www.google.com' ,target: '_blank'},
  'Click Me to visit google'
)
  
  const anotherElement = (
    <a href="https://google.com" target="_blank">Visit Google</a>
  )

createRoot(document.getElementById('root')).
render(
  
   // reactElement
   //anotherElement
   <App/>

)
