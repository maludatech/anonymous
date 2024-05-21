import '@styles/globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { AuthContextProvider } from './context/AuthContext';

export const metadata = {
  title: 'Anonymous by MaludaTech',
  description: 'An anonymous web application designed just for you',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <body>
           <Navbar/>
           <div className="flex items-start sm:items-center justify-center w-fit sm:w-full">
              <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-900 after:via-[#0141ff] after:blur-2xl after:content-[''] before:opacity-10 after:opacity-40 before:lg:h-[360px] z-[-1]"></div>
           </div>
           <div className="flex items-center justify-center w-fit">
              <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-900 after:via-[#0141ff] after:blur-2xl after:content-[''] before:opacity-10 after:opacity-40 before:lg:h-[360px] z-[-1]"></div>
           </div>
           {children}
           <div className="flex items-center justify-center w-fit">
              <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-900 after:via-[#0141ff] after:blur-2xl after:content-[''] before:opacity-10 after:opacity-40 before:lg:h-[360px] z-[-1]"></div>
           </div>
           <div className="flex items-start sm:items-center justify-center w-fit sm:w-full">
              <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-900 after:via-[#0141ff] after:blur-2xl after:content-[''] before:opacity-10 after:opacity-40 before:lg:h-[360px] z-[-1]"></div>
           </div>
           <Footer/>
        </body>
      </AuthContextProvider>
    </html>
  )
}