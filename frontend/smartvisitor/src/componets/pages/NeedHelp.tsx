import React, { useState, useCallback } from "react";
import { FaQuestionCircle, FaEnvelope, FaComments, FaTimes, FaPhoneAlt, FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NeedHelp: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    // Function to toggle the modal
    const toggleModal = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return (
        <>
            {/* Floating Help Button */}
            <button
                className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-800 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                onClick={toggleModal}
                aria-label="Open Help"
            >
                <FaQuestionCircle size={24} />
                <span className="hidden md:inline text-sm font-semibold">Need Help?</span>
            </button>

            {/* Help Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="w-full flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 min-w-xl text-white px-8 py-8 rounded-lg shadow-xl w-full  relative bg-opacity-90 backdrop-blur-md border border-gray-700"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                                <h2 className="text-xl font-semibold">Need Help? 🤖</h2>
                                <button onClick={toggleModal} className="text-gray-300 hover:text-red-500 transition" aria-label="Close Help">
                                    <FaTimes size={22} />
                                </button>
                            </div>

                            <p className="mt-4 text-gray-300">Choose an option below for assistance:</p>

                            {/* Support Options */}
                            <div className="mt-6 flex flex-col gap-5">
                                {/* Live Chat */}
                                <button
                                    className="flex items-center gap-4 p-4 bg-green-600 rounded-md hover:bg-green-700 transition"
                                    aria-label="Live Chat Support"
                                >
                                    <FaRobot size={22} /> Live Chat Assistant
                                </button>

                                {/* Email Support */}
                                <a
                                    href="mailto:support@example.com?subject=Support Request"
                                    className="flex items-center gap-4 p-4 bg-blue-600 rounded-md hover:bg-blue-700 transition"
                                    aria-label="Email Support"
                                >
                                    <FaEnvelope size={22} /> Email Support
                                </a>

                                {/* Call Support */}
                                <a
                                    href="tel:+1234567890"
                                    className="flex items-center gap-4 p-4 bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                                    aria-label="Call Support"
                                >
                                    <FaPhoneAlt size={22} /> Call Support
                                </a>

                                {/* FAQs */}
                                <a
                                    href="/faq"
                                    className="flex items-center gap-4 p-4 bg-gray-700 rounded-md hover:bg-gray-800 transition"
                                    aria-label="Visit FAQs"
                                >
                                    <FaComments size={22} /> Visit FAQs
                                </a>
                            </div>

                            {/* Footer */}
                            <p className="text-sm text-center text-gray-400 mt-6">Our team is available 24/7 for assistance.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NeedHelp;
