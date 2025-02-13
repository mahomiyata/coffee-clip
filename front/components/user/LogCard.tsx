import Link from 'next/link'
import { Box, Heading, Image, Text, HStack } from '@chakra-ui/react'

function LogCard(props: any) {
  const { display_name, handle_name, icon, review } = props
  return (
    <Link href={{ pathname: `/user/topPage/${handle_name}` }}>
      <Box
        my={12}
        p={8}
        borderRadius="16px"
        backgroundColor="orange.50"
        boxShadow="0px 2px 6px rgba(0, 0, 0, 0.3)"
      >
        <HStack mb={2}>
          <Image
            borderRadius="full"
            boxSize="70px"
            objectFit="cover"
            src={icon}
            alt={display_name}
          />
          <Box>
            <Heading size="lg">{display_name}</Heading>
            <Text>@{handle_name}</Text>
          </Box>
        </HStack>
        <HStack>
          {review && (
            <Box>
              <Text pt={4} letterSpacing="0.8px" fontSize="16px">
                {review.coffee_name}
              </Text>
              {review.image && (
                <Image
                  boxSize="250px"
                  objectFit="cover"
                  src={review.image}
                  alt={review.description}
                />
              )}
              <Text pt={4} letterSpacing="0.8px" fontSize="16px">
                {review.description}
              </Text>
            </Box>
          )}
        </HStack>
      </Box>
    </Link>
  )
}

export default LogCard
