"use client";

// エラー画面
// サーバーエラーの時に自動的に表示される
const Error = () => {
  return (
    <div>
      <div className='text-center text-5xl font-bold mb-3'>500</div>
      <div className='text-center text-xl font-bold'>Server Error</div>
    </div>
  );
};

export default Error;
