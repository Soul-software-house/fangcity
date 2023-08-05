import React from 'react'

const Load = (state) => {
  return (
    <>
       
            <div className='relative flex flex-col justify-center items-center w-full h-full'>
                <div className=' w-[25px] h-[25px] rounded-full animate-spin border-[rgba(255,255,255,0.5)] border-t-4 border-t-white border-4 tra'>
                </div>
                <p className='text-white font-bold mt-2'>Loading...</p>
                
            </div>

    </>
  )
}

export default Load