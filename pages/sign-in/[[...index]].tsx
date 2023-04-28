import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../src/img/logo.png';

const SignInPage = () => (
  <div className="flex items-center justify-center h-[100vh] background-image relative">
    <div className="absolute top-4 left-4 w-32 md:w-44 ">
      <Image src={Logo} alt="logo" />
    </div>
    <div className="-mt-10">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/chat-bot"
      />
    </div>
    <div className="absolute bottom-0 w-screen">
      <span className="block mx-auto p-4 md:py-6 font-bold text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023{' '}
        <Link
          href="https://www.unitaslink.com/"
          className="uppercase font-bold hover:underline"
          target="_blanck"
        >
          unitaslink
        </Link>
        . All Rights Reserved.
      </span>
    </div>
  </div>
);

export default SignInPage;
