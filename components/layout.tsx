import Link from 'next/link';
import { useClerk } from '@clerk/clerk-react';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { signOut } = useClerk();
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="h-16 border-b border-b-slate-200 py-4 ">
          <nav className="ml-4 pl-6 flex items-center justify-between">
            <div className="hover:text-slate-600 cursor-pointer text-xl font-semibold">Basis</div>
            <div className='flex items-center justify-start'>
              <div className='mr-8 text-lg font-semibold'>
                Faqs
              </div>
              <Link
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-16 mb-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                href="/"
                onClick={() => signOut()}
              >
                Sign out
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
