import { VFC, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'

import { useAuthContext } from '../../auth/AuthContext'
import { isLoggedIn } from '../../util'

import UserHeader from '../../components/user/UserHeader'
import InputForm from '../../components/InputForm'
import ImageUpload from '../../components/ImageUpload'
import Message from '../../components/Message'
import { useForm, FormProvider } from 'react-hook-form'
import { Heading, Box, Button } from '@chakra-ui/react'

const NewReview: WithGetAccessControl<VFC> = () => {
  const { currentUser } = useAuthContext()

  const methods = useForm()
  const [message, setMessage] = useState<string>()

  const postUser = async (userNewReview: Review, authId: string) => {
    axios
      .post(`/api/users/${authId}/reviews`, userNewReview, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setMessage('保存しました')
        }
      })
  }

  const onSubmit = (userNewReview: Review) => {
    if (currentUser) {
      postUser(userNewReview, currentUser)
    }
  }

  return (
    <Box>
      <Head>
        <title>新規投稿</title>
        <meta name="NewReview" content="プロフィール編集" />
      </Head>
      <UserHeader />
      <Heading size="md" m={'16px'}>
        新規投稿
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputForm
            thema="coffee_name"
            text="飲んだコーヒー"
            defaultValue=""
          />
          <ImageUpload
            // TODO thema textを修正
            thema="image"
            text="画像"
            size={'500px'}
          />
          <InputForm
            thema="description"
            text="感想やおすすめポイント"
            defaultValue=""
          />
          <Box>
            <Button mt={4} type="submit">
              投稿
            </Button>
          </Box>
        </form>
      </FormProvider>
      {message && <Message message={message} />}
    </Box>
  )
}

NewReview.getAccessControl = async () => {
  return !(await isLoggedIn())
    ? { type: 'replace', destination: '/user/signin' }
    : null
}

export default NewReview
