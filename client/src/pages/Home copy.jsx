import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiArrowRight,
  FiPlay,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiDatabase,
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiCloud,
  FiHeadphones,
  FiSettings,
  FiZap,
  FiStar,
  FiCheck,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiChevronDown,
  FiPlus,
  FiMinus,
  FiSend,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const ProSysCloudLanding = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const isVisible = (id) => visibleElements.has(id);

  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "DE", name: "Deutsch", flag: "🇩🇪" },
    { code: "ZH", name: "中文", flag: "🇨🇳" },
    { code: "KH", name: "ខ្មែរ", flag: "🇰🇭" },
  ];

  const faqs = [
    {
      question: "What business systems are included in ProSysCloud?",
      answer:
        "ProSysCloud includes comprehensive POS, HRM, CRM, Inventory Management, Project Management, and Accounting systems. Each system is fully integrated and can be customized to your specific business needs.",
    },
    {
      question: "Can I try the systems before purchasing?",
      answer:
        "Absolutely! We offer both sandbox testing environments and live demos for all our systems. You can explore the full functionality risk-free before making any commitment.",
    },
    {
      question:
        "What's the difference between one-time purchase and subscription?",
      answer:
        "The one-time purchase gives you complete ownership with on-premise deployment and source code access, while the subscription model provides cloud hosting, automatic updates, and ongoing support without the large upfront cost.",
    },
    {
      question: "How secure is my business data?",
      answer:
        "We use enterprise-grade security with bank-level encryption, regular security audits, and compliance with international data protection standards. Your data is protected with 99.9% uptime SLA.",
    },
    {
      question: "Do you provide training and support?",
      answer:
        "Yes! We provide comprehensive training, onboarding assistance, and 24/7 technical support. Our team of experts is always ready to help you maximize your system's potential.",
    },
    {
      question: "Can the systems be customized for my industry?",
      answer:
        "Definitely! All our systems are highly customizable and can be tailored to meet specific industry requirements, workflows, and business processes. We work closely with you to ensure perfect fit.",
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      position: "CEO",
      company: "TechFlow Solutions",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      content:
        "ProSysCloud transformed our business operations completely. The integrated systems saved us countless hours and improved our efficiency by 300%. Best investment we've made!",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      position: "Operations Manager",
      company: "Global Retail Group",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      content:
        "The POS and inventory management systems work seamlessly together. Real-time tracking and automated reports have revolutionized how we manage our 50+ locations.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      position: "Practice Owner",
      company: "Watson Medical Center",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      content:
        "Outstanding customer support and customization options. They tailored the systems perfectly for healthcare requirements. Our patient management is now effortless.",
      rating: 5,
    },
    {
      name: "James Kim",
      position: "IT Director",
      company: "Manufacturing Pro Inc",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      content:
        "The scalability is incredible. We started with 20 users and now have 200+. The cloud infrastructure handles our growth seamlessly with zero downtime.",
      rating: 5,
    },
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setContactForm({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
    });

    setIsSubmitting(false);
    alert("Thank you! Your message has been sent successfully.");
  };

  const handleContactChange = (e) => {
    setContactForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const systems = [
    {
      icon: FiShoppingBag,
      name: "POS System",
      description:
        "Complete point-of-sale solution with inventory management, sales tracking, and customer analytics.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiUsers,
      name: "HRM System",
      description:
        "Human resource management with payroll, attendance tracking, and employee performance metrics.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: FiTrendingUp,
      name: "CRM System",
      description:
        "Customer relationship management to track leads, manage contacts, and boost sales performance.",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: FiDatabase,
      name: "Inventory Management",
      description:
        "Advanced inventory control with real-time tracking, automated reordering, and supplier management.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: FiCalendar,
      name: "Project Management",
      description:
        "Streamlined project planning, task assignment, and team collaboration tools for better productivity.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: FiDollarSign,
      name: "Accounting System",
      description:
        "Comprehensive financial management with invoicing, expense tracking, and detailed reporting.",
      gradient: "from-yellow-500 to-amber-500",
    },
  ];

  const features = [
    {
      icon: FiCloud,
      title: "Scalable Cloud Hosting",
      description:
        "Auto-scaling infrastructure that grows with your business needs",
    },
    {
      icon: FiShield,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security protocols to protect your data",
    },
    {
      icon: FiHeadphones,
      title: "24/7 Professional Support",
      description: "Dedicated support team available around the clock",
    },
    {
      icon: FiSettings,
      title: "Fully Customizable",
      description:
        "Tailor every system to match your unique business requirements",
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Optimized performance with sub-second response times",
    },
    {
      icon: FiStar,
      title: "99.9% Uptime SLA",
      description: "Guaranteed reliability with industry-leading uptime",
    },
  ];

  const pricingPlans = [
    {
      name: "One-Time Purchase",
      price: "$2,999",
      period: "one-time + support",
      description: "Perfect for established businesses wanting full ownership",
      features: [
        "All business systems included",
        "On-premise deployment",
        "Source code access",
        "1 year premium support",
        "Free updates for 1 year",
        "Custom branding",
        "Training & onboarding",
      ],
      popular: false,
      buttonText: "Get Started",
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
    },
    {
      name: "SaaS Subscription",
      price: "$199",
      period: "per month",
      description: "Ideal for growing businesses seeking flexibility",
      features: [
        "All business systems included",
        "Cloud hosting & maintenance",
        "Automatic updates",
        "24/7 technical support",
        "Data backup & recovery",
        "Mobile app access",
        "Advanced analytics",
        "API integrations",
      ],
      popular: true,
      buttonText: "Start Free Trial",
      gradient:
        "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ProSys<span className="text-sky-600">Cloud</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 font-medium"
              >
                Home
              </a>
              <a
                href="#systems"
                className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 font-medium"
              >
                Systems
              </a>
              <a
                href="#pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 font-medium"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 font-medium"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 font-medium"
              >
                Contact
              </a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-1 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <FiGlobe className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">
                    {currentLanguage}
                  </span>
                  <FiChevronDown
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      isLanguageMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLanguage(lang.code);
                            setIsLanguageMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                            currentLanguage === lang.code
                              ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </button>

              {/* Try Now Button */}
              <button className="hidden lg:flex bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ml-2">
                Try Now
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ml-2"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
              <a
                href="#home"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#systems"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Systems
              </a>
              <a
                href="#pricing"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="block w-full text-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200 font-medium">
                  Try Now
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              All-in-One Business Systems
              <span className="text-sky-600"> in the Cloud</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Streamline your operations with our comprehensive suite of
              cloud-based business management systems. From POS to CRM, we've
              got everything your business needs to thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#systems"
                className="group bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                Explore Systems
                <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <button className="group border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center">
                Request Demo
                <FiPlay className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Systems Section */}
      <section id="systems" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible("systems-header")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            id="systems-header"
            data-animate
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Business Systems
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our comprehensive suite of business management
              solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systems.map((system, index) => {
              const IconComponent = system.icon;
              return (
                <div
                  key={system.name}
                  className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 ${
                    isVisible(`system-${index}`)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  id={`system-${index}`}
                  data-animate
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`bg-gradient-to-r ${system.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {system.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {system.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      Test
                    </button>
                    <button className="flex-1 border border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                      Live Demo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible("features-header")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            id="features-header"
            data-animate
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ProSysCloud?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enterprise-grade features designed for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
                    isVisible(`feature-${index}`)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  id={`feature-${index}`}
                  data-animate
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible("pricing-header")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            id="pricing-header"
            data-animate
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that best fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-gradient-to-br ${
                  plan.gradient
                } rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 ${
                  plan.popular ? "ring-2 ring-sky-600 scale-105" : ""
                } ${
                  isVisible(`plan-${index}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                id={`plan-${index}`}
                data-animate
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-sky-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <FiCheck className="w-5 h-5 text-sky-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "bg-sky-600 hover:bg-sky-700 text-white"
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible("testimonials-header")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            id="testimonials-header"
            data-animate
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied businesses worldwide
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-8 sm:p-12">
                    <div className="text-center">
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FiStar
                            key={i}
                            className="w-6 h-6 text-yellow-500 fill-current"
                          />
                        ))}
                      </div>

                      <blockquote className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="flex items-center justify-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white text-lg">
                            {testimonial.name}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {testimonial.position}
                          </div>
                          <div className="text-sky-600 dark:text-sky-400 font-medium">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentTestimonial === index
                      ? "bg-sky-600 dark:bg-sky-400"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible("faq-header")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            id="faq-header"
            data-animate
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Get answers to the most common questions about ProSysCloud
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-500 ${
                  isVisible(`faq-${index}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                id={`faq-${index}`}
                data-animate
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {expandedFAQ === index ? (
                      <FiMinus className="w-5 h-5 text-sky-600" />
                    ) : (
                      <FiPlus className="w-5 h-5 text-sky-600" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFAQ === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <div className="px-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible("contact-header")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            id="contact-header"
            data-animate
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ready to transform your business? Let's discuss your requirements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Let's Start a Conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Our team of experts is ready to help you find the perfect
                  business solution. Whether you need a demo, have questions, or
                  want to discuss custom requirements, we're here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-lg">
                    <FiMail className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Email Us
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      contact@prosyscloud.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-lg">
                    <FiPhone className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Call Us
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      +1 (555) 0123-4567
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-lg">
                    <FiMapPin className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Visit Us
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      123 Tech Street, San Francisco, CA 94105
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Business Hours
                </h4>
                <div className="text-gray-600 dark:text-gray-300 space-y-1">
                  <div>Monday - Friday: 8:00 AM - 6:00 PM PST</div>
                  <div>Saturday: 10:00 AM - 4:00 PM PST</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={contactForm.company}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="demo">Request a Demo</option>
                    <option value="pricing">Pricing Inquiry</option>
                    <option value="customization">Custom Solutions</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">
                      Partnership Opportunities
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    required
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 resize-none"
                    placeholder="Tell us about your requirements, questions, or how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                    isSubmitting ? "cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <FiSend className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  We'll respond within 24 hours during business days
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gray-900 dark:bg-gray-950 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4">
                ProSys<span className="text-sky-400">Cloud</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering businesses worldwide with comprehensive cloud-based
                management systems. Transform your operations with our
                cutting-edge technology.
              </p>
              <div className="flex space-x-4">
                <a
                  href="mailto:contact@prosyscloud.com"
                  className="flex items-center text-gray-400 hover:text-sky-400 transition-colors duration-200"
                >
                  <FiMail className="w-5 h-5 mr-2" />
                  contact@prosyscloud.com
                </a>
              </div>
              <div className="flex space-x-4 mt-2">
                <a
                  href="tel:+1-555-0123"
                  className="flex items-center text-gray-400 hover:text-sky-400 transition-colors duration-200"
                >
                  <FiPhone className="w-5 h-5 mr-2" />
                  +1 (555) 0123-4567
                </a>
              </div>
              <div className="flex space-x-4 mt-2">
                <span className="flex items-center text-gray-400">
                  <FiMapPin className="w-5 h-5 mr-2" />
                  San Francisco, CA
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#systems"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Systems
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    Status Page
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 ProSysCloud. All rights reserved. Built with ❤️ for
              modern businesses.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ProSysCloudLanding;
