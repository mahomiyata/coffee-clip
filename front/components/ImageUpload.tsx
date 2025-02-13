import { useRef, useState } from 'react'
import {
  Button,
  Image,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  InputGroup,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { FiFile } from 'react-icons/fi'
import { async } from '@firebase/util'

function ImageUpload(props: any) {
  const { size, thema, text } = props

  const {
    formState: { errors },
    register,
    setValue,
  } = useFormContext()

  const [image, setImage] = useState('')

  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register(thema)

  const validateFiles = (value: FileList | null) => {
    if (value) {
      if (value.length < 1) {
        return 'Files is required'
      }
      for (const file of Array.from(value)) {
        const fsMb = file.size / (1024 * 1024)
        const MAX_FILE_SIZE = 10
        if (fsMb > MAX_FILE_SIZE) {
          return 'Max file size 10mb'
        }
      }
      return true
    }
  }

  // アップされた画像データをimageにセット
  const handleChangeImage = (files: any) => {
    console.log(files)
    if (files) {
      encodeToBase64(files[0])
    }
  }

  // base64を生成する関数
  const encodeToBase64 = async (file: any) => {
    console.log(file)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result as string
      console.log(base64)
      setImage(base64)
      setValue(thema, base64)
    }
  }
  const handleClick = () => inputRef.current?.click()

  return (
    <>
      <FormControl isInvalid={!!errors.file_}>
        <FormLabel>{text}</FormLabel>
        <InputGroup onClick={handleClick}>
          <input
            id={thema}
            type="text"
            {...register(thema)}
            hidden
            onChange={(e) => console.log(e.target.value)}
          ></input>
          <input
            type={'file'}
            multiple={false}
            hidden
            accept="image/*"
            ref={(e) => {
              ref(e)
              inputRef.current = e
            }}
            onChange={(e) => {
              validateFiles(e.target.files)
              handleChangeImage(e.target.files)
            }}
          />
          <Button
            backgroundColor='brand.color4'
            color='white'
            leftIcon={<Icon as={FiFile} />}>Upload</Button>
        </InputGroup>
        <FormErrorMessage>
          {errors.thema && errors?.thema.message}
        </FormErrorMessage>
      </FormControl>
      {image && <Image w={size} src={image} />}
    </>
  )
}

export default ImageUpload
