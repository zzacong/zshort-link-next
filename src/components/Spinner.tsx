import Image from 'next/image'
import Oval from '$public/oval.svg'

export default function Spinner() {
  return (
    <div>
      <Image src={Oval} alt="Loading" />
    </div>
  )
}
