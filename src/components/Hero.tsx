import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
      <div className="max-w-3xl">
        <span className="px-3 py-1 text-sm rounded-full outline outline-1 outline-slate-300 inline-block mb-6">
          Powered by{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0051ff] to-[#ff0063]">
            "Creativity"
          </span>
        </span>
        <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0051ff] to-[#ff0063]">
          Luminara AI
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Engage with our intelligent chatbot for natural, meaningful
          conversations that adapt to your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button
            onClick={() => navigate("/luminara")}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Start Chatting
          </button>
          <button className="px-6 py-2 rounded-lg glass font-medium hover:bg-white/40 transition-all">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
