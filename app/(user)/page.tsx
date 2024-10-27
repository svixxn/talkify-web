import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Zap, Globe2 } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <nav className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Talkify</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-white transition"
            >
              About
            </a>
          </div>
          <div className="flex space-x-4">
            <Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white transition">
              Login
            </Button>
            <Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">
              Sign Up
            </Button>
          </div>
        </nav>

        <div className="text-center mt-24">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connect and Chat <br />
            <span className="text-blue-400">Without Limits</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience real-time communication with crystal-clear quality. Built
            for teams and individuals who value seamless connectivity.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="p-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold transition">
              Get Started Free
            </Button>
            <Button className="p-8 border bg-transparent hover:bg-transparent border-gray-600 hover:border-gray-400 text-white rounded-lg text-lg font-semibold transition">
              See How It Works
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Lightning Fast
            </h3>
            <p className="text-gray-400">
              Experience instant message delivery with our optimized
              infrastructure.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Secure by Design
            </h3>
            <p className="text-gray-400">
              End-to-end encryption ensures your conversations stay private.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe2 className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Global Reach
            </h3>
            <p className="text-gray-400">
              Connect with anyone, anywhere in the world seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-400 mb-8">
              Trusted by leading companies worldwide
            </p>
            <div className="flex justify-center items-center space-x-12 opacity-50">
              <div className="text-white font-bold text-xl">Talko Ltd.</div>
              <div className="text-white font-bold text-xl">Mankivskyi.io</div>
              <div className="text-white font-bold text-xl">
                Shymon Enterprise
              </div>
              <div className="text-white font-bold text-xl">Hanetskyi.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Talkify</span>
            </div>
            <div className="text-gray-400">
              © 2024 Talkify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
