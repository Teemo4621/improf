import { BiSolidError } from "react-icons/bi";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-7xl font-bold mb-4 text-[#0cc954]"><BiSolidError /></h1>
            <p className="text-4xl mb-6">Page Not Found</p>
            <p className="text-md text-gray-400"><span className="text-[#0cc954]">404</span> Sorry, the page you're looking for doesn't exist.</p>
            <a href="/login" className="mt-6 inline-block hover:scale-105 bg-[#0cc954] text-white font-semibold py-2 px-6 rounded-full text-lg hover:bg-[#0cc954d2] transition">
                Go to Homepage
            </a>
        </div>
    )
}