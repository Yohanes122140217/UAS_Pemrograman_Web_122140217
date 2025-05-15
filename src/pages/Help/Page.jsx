import { useState } from 'react';
import { Search, ChevronRight, MessageCircle, FileText, Phone, Mail, HelpCircle } from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Help categories with their respective FAQs
  const helpCategories = [
    {
      id: 1,
      name: 'Shopping & Orders',
      icon: <MessageCircle size={24} className="text-red-500" />,
      faqs: [
        { question: 'How do I track my order?', answer: 'You can track your order by going to "My Account > Orders" and clicking on the specific order you want to track. You will see the current status and estimated delivery date.' },
        { question: 'Can I change or cancel my order?', answer: 'You can change or cancel your order within 1 hour of placing it. Go to "My Account > Orders" and select the order you wish to modify. If the cancellation option is not available, the order has already been processed.' },
        { question: 'What payment methods do you accept?', answer: 'We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and campus cash cards at select colleges.' },
      ]
    },
    {
      id: 2,
      name: 'Returns & Refunds',
      icon: <FileText size={24} className="text-red-500" />,
      faqs: [
        { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for most items. Products must be in their original condition with all tags and packaging intact.' },
        { question: 'How do I request a refund?', answer: 'To request a refund, go to "My Account > Orders," select the order, and click "Return Items." Follow the instructions to complete your return request.' },
        { question: 'How long does it take to process a refund?', answer: 'Once we receive your returned item, refunds typically process within 3-5 business days. The time it takes for the money to appear in your account depends on your payment method and financial institution.' },
      ]
    },
    {
      id: 3,
      name: 'Account & Security',
      icon: <Phone size={24} className="text-red-500" />,
      faqs: [
        { question: 'How do I reset my password?', answer: 'To reset your password, click on "Forgot Password" on the login page. We will send a password reset link to your registered email address.' },
        { question: 'How do I update my personal information?', answer: 'You can update your personal information by going to "My Account > Profile Settings." Here you can edit your name, email, phone number, and other details.' },
        { question: 'Is my payment information secure?', answer: 'Yes, we use industry-standard encryption and security protocols to protect your payment information. We do not store your complete credit card details on our servers.' },
      ]
    },
    {
      id: 4,
      name: 'Shipping & Delivery',
      icon: <Mail size={24} className="text-red-500" />,
      faqs: [
        { question: 'What are your shipping options?', answer: 'We offer Standard Shipping (3-5 business days), Express Shipping (1-2 business days), and Same-Day Delivery for select campus areas. Shipping costs vary based on the selected method and order value.' },
        { question: 'Do you ship internationally?', answer: 'Currently, we only ship within the United States. We plan to expand our international shipping options in the future.' },
        { question: 'How do I change my shipping address?', answer: 'You can change your shipping address before your order is processed by going to "My Account > Orders," selecting the order, and clicking "Edit Shipping Details."' },
      ]
    },
  ];

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery ? 
    helpCategories.flatMap(category => 
      category.faqs
        .filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(faq => ({ ...faq, categoryId: category.id }))
    ) : [];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <div className="bg-red-600 rounded-xl p-8 mb-12 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
        <p className="mb-6 text-red-100 max-w-2xl mx-auto">
          Find answers to frequently asked questions, get support, and solve any issues you may have.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Search for answers..."
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          {filteredFaqs.length > 0 ? (
            <div className="bg-white rounded-lg shadow divide-y">
              {filteredFaqs.map((faq, index) => {
                const category = helpCategories.find(c => c.id === faq.categoryId);
                return (
                  <div key={index} className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-red-600 font-medium">{category.name}</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <HelpCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any answers matching your search. Try a different query or check out our help categories below.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {helpCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id === activeCategory ? null : category.id);
              setActiveFaq(null);
            }}
            className={`flex items-center justify-between p-6 rounded-lg shadow transition ${
              category.id === activeCategory 
                ? 'bg-red-600 text-white'
                : 'bg-white hover:bg-red-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`mr-4 ${category.id === activeCategory ? 'text-white' : ''}`}>
                {category.icon}
              </div>
              <h3 className="font-medium">{category.name}</h3>
            </div>
            <ChevronRight 
              size={20} 
              className={category.id === activeCategory ? 'text-white' : 'text-gray-400'} 
            />
          </button>
        ))}
      </div>

      {/* FAQs for selected category */}
      {activeCategory && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {helpCategories.find(c => c.id === activeCategory).name} FAQs
          </h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {helpCategories
              .find(c => c.id === activeCategory)
              .faqs.map((faq, index) => (
                <div key={index} className="p-6">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <ChevronRight 
                      size={20} 
                      className={`text-gray-400 transform transition-transform ${activeFaq === index ? 'rotate-90' : ''}`} 
                    />
                  </button>
                  {activeFaq === index && (
                    <div className="mt-4 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Still need help?</h2>
          <p className="text-gray-600">
            Our support team is available to assist you with any questions or concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-red-300 transition">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team in real-time.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Start Chat
            </button>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-red-300 transition">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
              <Phone size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak directly with our support team.</p>
            <a href="tel:1-800-123-4567" className="block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              1-800-123-4567
            </a>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-red-300 transition">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message about your issue.</p>
            <a href="mailto:support@collegestore.com" className="block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}