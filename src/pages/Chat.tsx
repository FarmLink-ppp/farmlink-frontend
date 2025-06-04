
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ChatbotUI from "@/components/chat/ChatbotUI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles, CheckCircle } from "lucide-react";

const Chat = () => {
  const faqs = [
    {
      question: "How do I identify nutrient deficiency in my crops?",
      answer: "Look for visual symptoms like yellowing leaves (nitrogen), purple stems (phosphorus), or brown leaf edges (potassium). Our AI can help diagnose with photo uploads.",
    },
    {
      question: "What's the best way to manage pests organically?",
      answer: "Consider companion planting, introducing beneficial insects, or using organic sprays like neem oil. Regular monitoring is key to early intervention.",
    },
    {
      question: "How much water do my crops need during summer?",
      answer: "Water requirements vary by crop, but generally 1-1.5 inches of water per week is recommended. Morning watering is most efficient.",
    },
    {
      question: "When should I rotate my crops?",
      answer: "Most crops benefit from 3-4 year rotation cycles. Avoid planting same-family crops in the same location in consecutive seasons.",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Modern Header Section */}
        <div className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 rounded-2xl p-8 border border-farmlink-lightgreen/20">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-farmlink-darkgreen">
                AI Farm Assistant
              </h1>
              <p className="text-farmlink-darkgreen/70 text-lg">
                Get instant answers to your farming questions from our specialized AI
              </p>
            </div>
          </div>
          
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-farmlink-lightgreen/20 text-farmlink-darkgreen text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by agricultural expertise from 120+ countries
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-16rem)] border-0 bg-white/70 backdrop-blur-sm shadow-xl">
              <CardContent className="p-0 h-full">
                <ChatbotUI />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-farmlink-darkgreen flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-farmlink-green" />
                  How Can I Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-farmlink-darkgreen/70 font-medium">Ask me about:</p>
                  <ul className="space-y-3">
                    {[
                      "Crop diseases and treatments",
                      "Planting schedules and techniques", 
                      "Pest management strategies",
                      "Soil health and fertilization",
                      "Weather-based farming advice"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center group">
                        <div className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen p-1.5 rounded-full mr-3 group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-farmlink-darkgreen">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-farmlink-darkgreen">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-farmlink-lightgreen/20 pb-4 last:border-0 last:pb-0 group">
                    <p className="font-semibold text-farmlink-darkgreen mb-2 group-hover:text-farmlink-green transition-colors duration-200">
                      {faq.question}
                    </p>
                    <p className="text-sm text-farmlink-darkgreen/70 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;