import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {faTwitter, faWhatsapp} from "@fortawesome/free-brands-svg-icons"

const About = () => {
  return (
    <div className="pt-8 px-3 flex flex-col gap-3 justify-center">

        <div className="text-[16px] flex flex-col gap-2 text-start">
            <p>
            Maluda's Anonymous is more than just a platform; it's a safe haven for expression, a sanctuary for voices that prefer the comfort of anonymity. Our mission is to provide individuals with a judgment-free space to share their thoughts, feelings, and experiences without fear or hesitation.
            </p>
            <p>
            Whether you have a secret to unveil, a confession to make, or simply want to connect with others without revealing your identity, Maluda's Anonymous is here for you. Our commitment to privacy and security ensures that your personal information remains confidential, allowing you to express yourself authentically and openly.
            </p>
        </div>
      
        <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Contact Us:</h3>
            <p className="text-[16px] pb-3">We value your feedback and are here to assist you. Feel free to reach out to us through the following channels:</p>
      
            <div className="flex flex-col gap-1 text-[16px]">
                <p>Email <FontAwesomeIcon icon={faEnvelope}/>: maludatech@gmail.com</p>
                <p>WhatsApp <FontAwesomeIcon icon={faWhatsapp}/>: +234 816 388 7385</p>
                <p>Twitter <FontAwesomeIcon icon={faTwitter}/>: @Maludatech</p>
            </div>
      
        </div>

      <p className="text-[16px] mt-4">
        Thank you for being a part of Maluda's Anonymous, where your voice matters, and your identity remains protected.
      </p>
    </div>
  );
};

export default About;
