import Image from "next/image"

const ABOUT_SECTIONS = [
  {
    title: "About Us",
    description: "We are a comprehensive learning management platform designed to connect learners, tutors, and administrators in one seamless digital experience. Our platform goes beyond just learning; it creates an ecosystem where education is managed, delivered, and experienced efficiently without going through any office stress.",
    image: "/about-us.png",
    reverse: false,
  },
  {
    title: "Our Mission",
    description: "Our mission is simple: to enhance the way education works by empowering every part of the system. From learners gaining knowledge, to tutors delivering impactful lessons, to administrators managing operations with ease.",
    image: "/mission.png",
    reverse: true, // Image on the left
  },
  {
    title: "Who We Serve",
    isGrid: true, 
    items: [
      { role: "Learners/Interns", text: "Access structured courses, track progress, and learn at your own pace with innovative and engaging experience." },
      { role: "Tutors", text: "Create, manage, and deliver courses effortlessly while engaging with students and tracking their performance." },
      { role: "Administrators", text: "Oversee the entire platform, manage users, monitor activities and ensure everything runs smoothly from a central dashboard." }
    ]
  },
  {
    title: "Why Choose Us",
    description: "We understand that education is not just about content; it's about structure, delivery, and management. That's why we've built a platform that supports every role involved, ensuring a smooth, seamless and effective learning environment.",
    image: "/choose-us.png",
    reverse: false,
  },
  {
    title: "Our Vision",
    description: "To build a smart, all-in-one learning ecosystem that transforms how education is delivered, managed, and experienced globally.",
    image: "/vision.png",
    reverse: true,
  }
]

export default function About() {
  return (
    <section id="about" className="w-full py-12 bg-white font-sans">
      <div className="max-w-6xl mx-auto px-6 space-y-12 md:space-y-20">
        
        {ABOUT_SECTIONS.map((section, index) => {
          // Special Grid Section: "Who We Serve"
          if (section.isGrid) {
            return (
              <div key={index} className="w-full text-center py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#07142F] mb-12">Who We Serve</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.items?.map((item, i) => (
                    <div key={i} className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-lg text-[#07142F] mb-4">{item.role}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Standard Alternating Section
          return (
            <div 
              key={index} 
              className={`flex flex-col ${section.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16 bg-[#F8FAFC] rounded-3xl overflow-hidden border border-gray-100 p-8 md:p-0`}
            >
              {/* Text Area */}
              <div className="w-full md:w-1/2 md:p-12 lg:p-16 flex flex-col justify-center text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-[#07142F] mb-6">{section.title}</h2>
                <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                  {section.description}
                </p>
              </div>

              {/* Image Area */}
              <div className="w-full md:w-1/2 relative h-[250px] md:h-[400px]">
                <Image 
                  src={section.image || ""} 
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )
        })}

      </div>
    </section>
  )
}