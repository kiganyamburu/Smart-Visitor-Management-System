
const Footer = () => {
    return (
        <footer className="w-full mt-8 bg-white text-teal-900 py-8 shadow-md">

            {/* Bottom Section */}
            <div className="mt-6 text-center text-gray-500 text-sm border-t border-gray-300 pt-4">
                © {new Date().getFullYear()} Chuka University. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
