import NextLink from 'next/link'
import {
  Container,
  Box,
  Heading,
  useColorModeValue,
  chakra,
  Link,
  Button
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { IoLogoGithub } from 'react-icons/io5'
import Image from 'next/legacy/image'
import Section from '../components/section'
import Paragraph from '../components/paragraph'
// import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Page = () => {
  return <>1</>
  return (
    <Layout>
      {/* <Container> */}
        {/* <Box
          borderRadius="lg"
          mb={6}
          p={3}
          align="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          css={{ backdropFilter: 'blur(10px)' }}
        >
          Hello, I&apos;m a Front-end developer based in Hangzhou, China!
        </Box> */}

        
      {/* </Container> */}
    </Layout>
  )
}

export default Page
