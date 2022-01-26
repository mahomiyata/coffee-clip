import { Request, Response } from 'express'
import connectToDB from '../db-connection'
import ShopsDataModel from '../schema/shopSchema'

export const getShops = async (req: Request, res: Response) => {
    await connectToDB()
    const data = await ShopsDataModel.find()
    res.send(data)
}

export const getShop = async (req: Request, res: Response) => {
    await connectToDB()
    const data = await ShopsDataModel.find({
        $or: [
            { auth_id: req.params.authId },
            { handle_name: req.params.handleName },
        ],
    })
    res.json(data)
}

export const putShop = async (req: Request, res: Response) => {
    await connectToDB()
    await ShopsDataModel.updateOne({ auth_id: req.params.authId }, req.body)
    const data = await ShopsDataModel.findOne({ auth_id: req.params.authId })
    res.send(data)
}

export const postShop = async (req: Request, res: Response): Promise<void> => {
    await connectToDB()
    const { auth_id, handle_name, display_name, icon } = req.body

    const authIdCheck = await ShopsDataModel.findOne({
        auth_id: auth_id,
    })

    const handleNameCheck = await ShopsDataModel.findOne({
        handle_name: handle_name,
    })

    if (!authIdCheck && !handleNameCheck) {
        interface Shop {
            auth_id: String
            handle_name: String
            display_name: String
            icon: String | undefined
            address: String
            map_url: String
            hp_url: String
            instagram_url: String
            opening_hours: String
            regular_day_off: String
            concept: String
            follower_handle_name: Array<String>
        }

        const newShopUser: Shop = {
            auth_id: auth_id,
            handle_name: handle_name,
            display_name: display_name,
            icon: icon,
            address: '',
            map_url: '',
            hp_url: '',
            instagram_url: '',
            opening_hours: '',
            regular_day_off: '',
            concept: '',
            follower_handle_name: [],
        }

        await ShopsDataModel.create(newShopUser)
        res.status(200).end()
    } else {
        res.status(400).end()
    }
}
