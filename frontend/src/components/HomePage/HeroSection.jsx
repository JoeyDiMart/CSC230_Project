import { FaUniversity } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="relative w-screen h-[80vh]  bg-cover bg-[center_30%] bg-no-repeat flex items-center justify-end pt-4" style={{backgroundImage:`url('/BackgroundImage2.png')`}}>
      <div className="max-w-2xl mr-5">
        <div className="flex justify-center items-center gap-3 text-cirtRed">
          <FaUniversity size={28} />
          <span className="uppercase font-semibold tracking-wide text-sm">
            Criminology Institute Of Research And Training
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-testingColorWhite leading-tight">
          Empowering Criminal Justice Through Research & Training
        </h1>
        <p className="text-testingColorSubtitle max-w-2xl mx-auto text-base md:text-lg">
          The Criminology Institute for Research and Training (CIRT) connects faculty, students, and professionals to drive innovation, shape policy, and transform the future of criminal justice.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/#/Research-Associates"
            className="bg-cirtRed text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300"
          >
            Learn More
          </a>
          <a
            href="/#/Publications"
            className="border border-cirtRed text-cirtRed px-6 py-3 rounded-full font-semibold hover:bg-cirtRed hover:text-white transition duration-300"
          >
            View Publications
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
