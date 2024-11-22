import { ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import Layout from '../components/layouts/main'
import Fonts from '../components/fonts'
import theme from '../lib/theme'
// import Script from 'next/script'
import { useEffect } from 'react'
// import Lynkco09 from '../components/lynkco09'

function Website({ Component, pageProps, router }) {
  // const { loading, setLoading } = useState(true)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 2000)
  // }, [])
  // useEffect(() => {
  //   const VConsole = require('vconsole')
  //   new VConsole()
  // }, [])
  // if (loading) {
  //   return <div>loading...</div>
  // }
  // return <Lynkco09 />
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Layout router={router}>
        {/* <AnimatePresence
          // exitBeforeEnter
          mode="wait"
          initial={true}
          onExitComplete={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0 })
            }
          }}
        >
          <Component {...pageProps} key={router.route} />
        </AnimatePresence> */}
      </Layout>
      {/* <Script
        src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"
        onLoad={() => {
          const vConsole = new window.VConsole()
        }}
      /> */}
    </ChakraProvider>
  )
}

export default Website
