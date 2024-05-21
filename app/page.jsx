import Link from "next/link";
import About from "./components/About";

export default function Home() {
  return (
    <section className="flex flex-col gap-3">
    <div className='px-3 pt-20 flex flex-col sm:flex-row gap-6 w-full'>
      <div className='flex flex-col gap-2 sm:w-1/2'>
        <h1 className='font-poppins font-bold text-xl'>
          Welcome to <span className='white_gradient text-2xl'>Maluda's Anonymous</span> 🤞🏾
        </h1>
        <p className='ash_gradient flex-wrap'>
          At Maluda's Anonymous, we believe that every voice deserves to be heard, even those shrouded in anonymity. Our platform is designed to provide you with a safe and secure space to share your thoughts, confessions, compliments, or questions without ever revealing your true identity. Whether you have a secret to share, a kind message to send, or a story to tell, we're here to amplify your voice while preserving your privacy.
        </p>
      </div>

      <div className="w-full sm:w-1/2">
        <p className="white_gradient font-semibold text-lg mb-2">
          Get Started Today:
        </p>
        <div className="flex flex-col gap-4">
          <Link href={"/sign-up"} className="rounded-lg border-2 border-gray-500 px-5 py-3 w-full text-center bg-black text-white font-semibold font-poppins hover:bg-white hover:text-black">
            Register
          </Link>
          <Link href={"/sign-in"} className="rounded-lg border-2 px-5 w-full text-center border-gray-500 py-3 text-black font-semibold  bg-white font-poppins hover:bg-black hover:text-white">
            Sign In
          </Link>
        </div>
      </div>
    </div>
    <About/>
    </section>
  );
}
