import { forwardRef } from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export const CarSpinner = () => (
  <Spinner
    size="xl"
    position="absolute"
    left="50%"
    top="50%"
    ml="calc(0px - var(--spinner-size) / 2)"
    mt="calc(0px - var(--spinner-size))"
  />
)

export const CarContainer = forwardRef(({ children }, ref) => (
  // <div
  //   ref={ref}
  //   className="lynkco09"

  // >
  //   {children}
  // </div>
  <Box
    ref={ref}
    className="lynkco09"
    m="auto"
    w={[280, 480, 640]}
    h={[280, 480, 640]}
    position="relative"
    style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0
    }}
  >
    {children}
    <div style={{ position: 'fixed', top: 10, left:10, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
      <img
        src={'/logo.png'}
        alt=""
        style={{
          width: 166,
          height: 34.5,
          zIndex: 10
        }}
      />
      <div style={{fontWeight: 'bold', fontSize: 24, color: 'white', float:'left'}}> 车辆配置器</div>
    </div>
  </Box>
))

const Loader = () => {
  return (
    <CarContainer>
      <CarSpinner />
    </CarContainer>
  )
}

export default Loader
