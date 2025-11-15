import { Award, Users, Globe, Heart } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Years in Business', value: '15+' },
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Products Sold', value: '200K+' },
    { label: 'Countries Served', value: '25+' },
  ];

  const team = [
    {
      name: 'Yeahyea Karim Rafi',
      role: 'Managing Director',
      image: 'https://imagizer.imageshack.com/img922/9499/vwynqK.jpg',
    },
    {
      name: 'Parvej Ahmed',
      role: 'Chief Executive Officer',
      image: 'https://imagizer.imageshack.com/img923/6387/6nSfYV.jpg'

    },
     {
      name: 'Rokibul Hasan Rokib',
      role: 'Software Engineer',
      image: 'https://imagizer.imageshack.com/img924/2017/WGIWLR.jpg'

    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
            About <span className="text-red-300">BONGO</span><span className="text-blue-300">Shoes</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            We believe that great shoes can change your day, your confidence, and your life. 
            That's why we've dedicated ourselves to crafting the perfect footwear for every step of your journey.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>Since 2024, Bongo Shoes has been dedicated to bringing comfort and class together in every step. Our story began in a small workshop filled with big dreams — and over time, those dreams walked across Bangladesh.</p>
                <p>Each pair we craft reflects our belief that true style is built on quality and care. We’ve grown beyond our beginnings, but our promise stays unchanged: to keep making shoes that feel right and last long.</p>
              </div>
            </div>
            <div className="group relative">
              <img
                src="https://imagizer.imageshack.com/img922/9530/nC4DqC.png"
                alt="Our workshop"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
<section className="py-20 bg-gradient-to-br from-white via-slate-50 to-blue-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
        Meet Our Team
      </h2>
      <p className="text-lg md:text-xl text-gray-600">
        The passionate people behind <span className="text-red-600">BONGO</span><span className="text-blue-600">Shoes</span>
      </p>
    </div>

    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
      {team.map((member, index) => (
        <div
          key={index}
          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20
                    hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-56 sm:w-64 md:w-72 text-center p-6 sm:p-8"
        >
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-5 md:mb-6">
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-gradient-to-r from-indigo-500 to-pink-500
                        shadow-lg group-hover:scale-105 transition-transform duration-300 object-top"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
          <p className="text-blue-600 font-medium mb-3 text-sm sm:text-base md:text-base">{member.role}</p>

          <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Values Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The principles that guide everything we do
            </p>
          </div>
          
          {/* Responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group text-center p-4 sm:p-5 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-3">Quality First</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-base leading-relaxed">We never compromise on the quality of our materials or craftsmanship.</p>
            </div>

            {/* Card 2 */}
            <div className="group text-center p-4 sm:p-5 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="bg-gradient-to-br from-green-400 to-green-500 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-3">Customer Focus</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-base leading-relaxed">Our customers are at the heart of everything we do.</p>
            </div>

            {/* Card 3 */}
            <div className="group text-center p-4 sm:p-5 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-3">Sustainability</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-base leading-relaxed">We're committed to sustainable practices and ethical manufacturing.</p>
            </div>

            {/* Card 4 */}
            <div className="group text-center p-4 sm:p-5 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="bg-gradient-to-br from-red-400 to-red-500 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-3">Passion</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-base leading-relaxed">We love what we do, and it shows in every product we create.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}