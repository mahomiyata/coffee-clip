import { useEffect, useState, VFC } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'

import { useAuthContext } from '../../../../auth/AuthContext'
import { isLoggedIn } from '../../../../util'

import PrimaryButton from '../../../../components/Button'
import Profile from '../../../../components/Profile'
import LogCard from '../../../../components/user/LogCard'
import UserHeader from '../../../../components/user/UserHeader'

import { Box, Text, Stack, Spacer, Flex } from '@chakra-ui/react'

const UserTopPage: WithGetAccessControl<VFC> = () => {
  const { currentUser } = useAuthContext()

  const router = useRouter()
  const { handle_name } = router.query

  const initial = {
    auth_id: '',
    handle_name: '',
    display_name: '',
    icon: '',
    follower_handle_names: [''],
    followee_handle_names: [''],
    followee_shops_handle_names: [''],
    reviews: [''],
  }

  const [userInfo, setUserInfo] = useState<UserData | null>(null)
  const [isFollow, setIsFollow] = useState<boolean>(false)

  const getUser = async (handle: string | string[], authId: string) => {
    const res: any = await axios.get(`/api/users/${authId}/${handle}`)

    const myUser = await axios.get(`/api/users/${currentUser}`)

    if (myUser.data.handle_name === handle_name) {
      router.replace('/user/mypage')
    } else {
      setUserInfo(res.data)
      setIsFollow(res.data.is_following)
    }
  }

  useEffect(() => {
    if (handle_name && currentUser) {
      getUser(handle_name, currentUser)
    }
  }, [handle_name, currentUser])

  const unfollow = () => {
    const putUser = async (authId: string) => {
      await axios.put(
        `/api/users/${authId}/users/unfollowing`,
        {
          handle_name: userInfo?.handle_name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (handle_name && currentUser) {
        getUser(handle_name, currentUser)
      }
    }

    if (currentUser) {
      putUser(currentUser)
    }
  }

  const follow = () => {
    const putUser = async (authId: string) => {
      await axios.put(
        `/api/users/${authId}/users/following`,
        {
          handle_name: userInfo?.handle_name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (handle_name && currentUser) {
        getUser(handle_name, currentUser)
      }
    }

    if (currentUser) {
      putUser(currentUser)
    }
  }

  const orFollow = () => {
    if (isFollow) {
      setIsFollow(false)
      unfollow()
    } else {
      setIsFollow(true)
      follow()
    }
  }

  return (
    <Box>
      <Head>
        <title>トップページ</title>
        <meta name="userTopPage" content="ユーザートップページ" />
      </Head>
      <UserHeader />

      {userInfo && (
        <Flex>
          <Profile
            display_name={userInfo.display_name}
            handle_name={userInfo.handle_name}
            icon={userInfo.icon}
          />
          <Spacer />
          <Box>
            <Text>{userInfo.followee_handle_names.length}</Text>
            <Text>フォロー</Text>
          </Box>
          <Box>
            <Text>{userInfo.follower_handle_names.length}</Text>
            <Text>フォロワー</Text>
          </Box>
          <Box>
            <Text>{userInfo.followee_shops_handle_names.length}</Text>
            <Text>お気に入りShop</Text>
          </Box>
        </Flex>
      )}

      {userInfo && (
        <Flex>
          {isFollow && <Box m="20px">フォロー中</Box>}
          <PrimaryButton
            text={isFollow ? 'フォローを外す' : 'フォローする'}
            onclick={orFollow}
          />
        </Flex>
      )}

      <Stack>
        {userInfo && (
          <Box>
            {userInfo.reviews.map((data: any, key: any) => {
              return (
                <LogCard
                  key={key}
                  display_name={userInfo.display_name}
                  handle_name={userInfo.handle_name}
                  icon={userInfo.icon}
                  review={data}
                />
              )
            })}
          </Box>
        )}
      </Stack>
    </Box>
  )
}

UserTopPage.getAccessControl = async () => {
  return !(await isLoggedIn())
    ? { type: 'replace', destination: '/user/signin' }
    : null
}

export default UserTopPage
