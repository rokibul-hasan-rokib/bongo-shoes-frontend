import React from "react";
import { CheckCircle } from "lucide-react";

const OrderConfirmationMessage = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-slate-100 px-6">
      <div className="max-w-xl w-full text-center bg-white shadow-2xl my-4 rounded-2xl border border-gray-200 p-10 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full shadow-inner animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-3">
          🎉 আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
        </h2>

        <p className="text-gray-700 text-[17px] leading-relaxed font-medium mb-4">
          আপনার অর্ডারটি সফলভাবে সংরক্ষণ করা হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি
          ফোনের মাধ্যমে আপনার সাথে যোগাযোগ করবেন অর্ডারটি নিশ্চিত করার জন্য।
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
          <p className="text-green-800 font-semibold">
            ✅ অর্ডার আইডি এবং বিস্তারিত তথ্য শীঘ্রই আপনার ইমেইলে পাঠানো হবে।
          </p>
        </div>

        <div className="mt-8 text-gray-700 text-[16px] font-medium leading-relaxed">
          ❤️ ধন্যবাদ আমাদের সাথে থাকার জন্য।  
          <br />আপনার সন্তুষ্টিই আমাদের সর্বোচ্চ অগ্রাধিকার।
        </div>

        <div className="mt-10">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🏠 হোমে ফিরে যান
          </a>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationMessage;
