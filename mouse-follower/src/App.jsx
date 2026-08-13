import {useEffect, useState} from 'react' 

function App() {
  const [enabled, setEnabled] = useState(false)
  const [position, setPosition] = useState({x: 0, y: 0})

  useEffect(() => {
console.log('effect', {enabled})

  const handleMove = (event) => {
    const { clientX, clientY } = event 
    console.log('handlemove', {clientX, clientY})
    setPosition({x: clientX, y: clientY})
  }

  if(enabled) {
    window.addEventListener('pointermove', handleMove)
  }

  return () => {
    window.removeEventListener('pointermove', handleMove)
  }
  },[enabled])
  
  return (
    <main>
      <div style={{
        position: 'absolute',
        backgroundColor: 'rgb(149, 188, 214)',
        borderRadius: '50%',
        opacity: 0.8,
        pointerEvents: 'none',
        top: -20,
        left: -20,
        width: 40,
        height: 40,
        transform: `translate(${position.x}px, ${position.y}px)`
      }}>
      </div>

    <button onClick={() => setEnabled(!enabled)}> {enabled ? 'Desactivar' : 'Activar'} seguir puntero</button>
    </main>
    
  )
} 

export default App 