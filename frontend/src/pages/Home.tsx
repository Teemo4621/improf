import { Button } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500 opacity-20 blur-3xl rounded-full"></div>
      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold mb-4">
          Unlock Your Creativity.
          <br />
          Create, Customize,
          <br />
          Build & Showcase Your Profile. ✨
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-lg">
          Create Your Own Personal Profile Website with Endless Customization.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            type="primary"
            size="large"
            icon={<FaArrowRight />}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
            onClick={() => navigate("/create")}
          >
            Create Profile
          </Button>
          <Button
            style={{ backgroundColor: "transparent" }}
            size="large"
            icon={<SiGoogledocs />}
            className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200"
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
