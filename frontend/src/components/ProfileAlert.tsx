import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'

function ProfileAlert() {
    const [show, setShow] = useState(true)

    return (
        <div className={`flex items-center justify-between w-full text-center p-2 bg-green-400 text-white font-bold ${show ? 'opacity-100' : 'opacity-0'} duration-200 transform`}>
            <div className=""></div>
            <p>✨ อยากสร้างโปรไฟล์เป็นของตัวเอง <a href="/login" className='underline'>กดที่นี้ได้เลย!</a></p>
            <div className="text-end text-xl cursor-pointer duration-200 hover:opacity-85 hover:scale-105" onClick={() => setShow(false)}>
                <IoMdClose />
            </div>
        </div>
    )
}

export default ProfileAlert