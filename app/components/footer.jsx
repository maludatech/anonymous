import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return(
    <div className="fixed bottom-0 py-3 px-2 border-t-2 border-gray-400 flex justify-between w-full z-10 bg-black">
        <h1 className="sm:text-lg white_gradient flex">Copyright {currentYear} &copy; <span className="hidden sm:flex">Maluda's Anonymous.</span></h1>

        <div className="flex gap-4 sm:gap-6">
          <Link href={"https://www.instagram.com/maludatech/"} className="hover:scale-105 text-lg sm:text-xl"><FontAwesomeIcon icon={faInstagram}/></Link>
          <Link href={"https://twitter.com/maludatech"}className="hover:scale-105 text-lg sm:text-xl"><FontAwesomeIcon icon={faGithub} /></Link>
          <Link href={"https://github.com/maludatech"}className="hover:scale-105 text-lg sm:text-xl"><FontAwesomeIcon icon={faTwitter} /></Link>
        </div>
    </div>
    );
};
export default Footer;