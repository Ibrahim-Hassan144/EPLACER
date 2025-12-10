import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
export default function LoadMore({onClick}) {
  return (
    <div onClick={onClick} className='flex items-center justify-center bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl p-6'>
      <div className='text-center'>
        <AiOutlinePlusCircle className='text-4xl text-primary mx-auto' />
        <div className='mt-2 text-sm text-gray-600'>Show more</div>
      </div>
    </div>
  );
}
