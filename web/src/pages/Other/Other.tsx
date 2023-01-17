import Box from "../../components/Box"

export const Other = () => {
    return <main className="other">
      {/* Componentes que aceitam JSX como entrada */}
      <Box background="light">
        <h1>Container 1</h1>
      </Box>
      
      <Box background="dark">
        <h1>Container 2</h1>
      </Box>
    </main>
  }