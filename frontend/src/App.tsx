import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className=''>Welcome to Strapi LMS</h1>
      <Button variant={ "secondary" }>Test</Button>
    </>
  )
}

export default App
