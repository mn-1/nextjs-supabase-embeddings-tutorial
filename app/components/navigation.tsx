"use client";

import Link from "next/link";

// ナビゲーション
// header
const Navigation = () => {
  return (
    <header className='border-b py-5'>
      <div className='text-center'>
        <Link href='/' className='font-bold text-xl cursor-pointer'>
          Header Sample
        </Link>
      </div>
    </header>
  );
};

export default Navigation;
