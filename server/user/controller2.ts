import { Request, Response } from 'express'
import userModel from '../schema/userSchema'
import connectToDB from '../db-connection'

export const putUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    await connectToDB()
    await userModel.updateOne({ auth_id: req.params.authId }, req.body)
    const data = await userModel.findOne({ auth_id: req.params.authId })
    res.send(data)
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
    await connectToDB()
    const data = await userModel.findOne({
        $or: [
            { auth_id: req.params.authId },
            { handle_name: req.params.handleName },
        ],
    })
    res.json(data)
}

export const putFollowUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    await connectToDB()
    const user = await userModel.findOne({
        handle_name: req.params.handleName,
    })
    // console.log(user)

    const currentUser = await userModel.findOne({
        auth_id: req.body.auth_id,
    })
    // console.log(currentUser)

    if (!user || !currentUser) {
        res.status(400).send({ error: '見つかりませんでした' })
    } else if (!user.follower_handle_names?.includes(req.body.handle_name)) {
        const userList = user.follower_handle_names
        const currentUserList = currentUser.followee_handle_names
        if (userList) {
            userList.push(currentUser.handle_name)
        }
        if (currentUserList) {
            currentUserList.push(user.handle_name)
        }

        await userModel.updateOne(
            { handle_name: req.params.handleName },
            { follower_handle_names: userList }
        )

        await userModel.updateOne(
            { auth_id: req.body.auth_id },
            { followee_handle_names: currentUserList }
        )

        const updateUser = await userModel.findOne({
            handle_name: req.params.handleName,
        })
        res.json(updateUser)
    } else {
        res.status(403).json('you already follow this users')
    }
}

export const unfollowUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    await connectToDB()
    const user = await userModel.findOne({
        handle_name: req.params.handleName,
    })

    const currentUser = await userModel.findOne({
        auth_id: req.body.auth_id,
    })

    if (!user || !currentUser) {
        res.status(400).send({ error: '見つかりませんでした' })
    } else if (!user.follower_handle_names?.includes(currentUser.handle_name)) {
        res.status(403).send({ error: '☆まだフォローしていません' })
    } else if (!currentUser.followee_handle_names?.includes(user.handle_name)) {
        res.status(403).send({ error: 'まだフォローしていません' })
    } else {
        const userList = user.follower_handle_names
        for (let i = 0; i < userList.length; i++) {
            if (userList[i] === currentUser.handle_name) {
                userList.splice(i, 1)
            }
        }

        await userModel.updateOne(
            { handle_name: req.params.handleName },
            { follower_handle_names: userList }
        )

        const currentUserList = currentUser.followee_handle_names
        for (let i = 0; i < currentUserList.length; i++) {
            if (currentUserList[i] === user.handle_name) {
                currentUserList.splice(i, 1)
            }
        }

        await userModel.updateOne(
            { auth_id: req.body.auth_id },
            { followee_handle_names: currentUserList }
        )

        const updateUser = await userModel.findOne({
            handle_name: req.params.handleName,
        })
        res.json(updateUser)
    }
}
