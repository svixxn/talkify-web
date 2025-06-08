import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Zap, Globe2, Check } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <nav className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Talkify</span>
          </div>

          <AuthModal />
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
          <div className="flex justify-center space-x-4"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12">
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

      <div id="solutions" className="bg-slate-800/30 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for every <span className="text-blue-400">team size</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From startups to enterprises, ChatSync scales with your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&crop=center"
                alt="Team collaboration"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">For Teams</h3>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Streamline your team communication with channels and direct
                messages. Keep everyone aligned and productive.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  Unlimited channels and direct messages
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  Advanced admin controls and permissions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-400 mb-8">
              Trusted by leading companies worldwide
            </p>
            <div className="flex flex-col gap-4 md:flex-row justify-center items-center md:space-x-12 opacity-50">
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
              © {new Date().getFullYear()} Talkify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
