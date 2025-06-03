
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ChatbotUI from "@/components/chat/ChatbotUI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <MessageSquare className="mr-2 h-7 w-7 text-farmlink-green" />
            AI Farm Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Get instant answers to your farming questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              <CardContent className="p-0 h-full">
                <ChatbotUI />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How Can I Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">Ask me about:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="bg-primary/10 p-1 rounded-full mr-2">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-sm">Crop diseases and treatments</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary/10 p-1 rounded-full mr-2">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-sm">Planting schedules and techniques</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary/10 p-1 rounded-full mr-2">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-sm">Pest management strategies</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary/10 p-1 rounded-full mr-2">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-sm">Soil health and fertilization</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary/10 p-1 rounded-full mr-2">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-sm">Weather-based farming advice</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                    <p className="font-medium mb-1">{faq.question}</p>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
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
