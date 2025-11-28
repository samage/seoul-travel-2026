import React, { useState } from 'react';
import { 
  MapPin, 
  Utensils, 
  Train, 
  ChevronDown, 
  ChevronUp, 
  Navigation, 
  Info, 
  Calendar, 
  Phone, 
  Home, 
  Plane,
  Camera,
  ShoppingBag,
  Star,
  Map
} from 'lucide-react';
import itineraryData from './data/itinerary.json';
import travelInfo from './data/travelInfo.json';

const SeoulTravelApp = () => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [expandedDay, setExpandedDay] = useState(-1);

  const openMap = (location) => {
    // 嘗試打開 Naver Map app
    const appUrl = `nmap://search?query=${encodeURIComponent(location)}`;
    const webUrl = `https://map.naver.com/v5/search/${encodeURIComponent(location)}`;
    
    // 記錄開始時間
    const startTime = Date.now();
    let appOpened = false;
    
    // 嘗試打開 app
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    
    // 監聽頁面是否失去焦點（表示 app 可能已打開）
    const blurHandler = () => {
      appOpened = true;
      document.body.removeChild(iframe);
      window.removeEventListener('blur', blurHandler);
    };
    
    window.addEventListener('blur', blurHandler);
    
    // 如果 500ms 內沒有打開 app，則打開網頁版
    setTimeout(() => {
      if (!appOpened) {
        document.body.removeChild(iframe);
        window.removeEventListener('blur', blurHandler);
        window.open(webUrl, '_blank');
      }
    }, 500);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'food': return <Utensils size={20} className="text-emerald-600" strokeWidth={2} />;
      case 'transport': return <Train size={20} className="text-indigo-600" strokeWidth={2} />;
      case 'activity': return <Camera size={20} className="text-slate-600" strokeWidth={2} />;
      case 'shopping': return <ShoppingBag size={20} className="text-violet-600" strokeWidth={2} />;
      case 'info': return <Info size={20} className="text-teal-600" strokeWidth={2} />;
      default: return <MapPin size={20} className="text-emerald-600" strokeWidth={2} />;
    }
  };

  const WeatherWidget = () => (
    <div className="bg-gradient-to-br from-slate-100 via-indigo-50 to-teal-50 backdrop-blur-sm sticky top-0 z-10 px-6 py-10 border-b border-slate-200 shadow-sm">
      <div className="relative">
        <h1 
          className="text-5xl mb-2"
          style={{
            fontFamily: "'Long Cang', 'Zhi Mang Xing', 'Noto Serif SC', serif",
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 30%, #7e8ba3 60%, #c9a9a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '2px 2px 8px rgba(30, 60, 114, 0.3), 0 0 20px rgba(42, 82, 152, 0.2)',
            letterSpacing: '0.15em',
            fontWeight: '400',
            lineHeight: '1.3',
            transform: 'perspective(500px) rotateX(5deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          首爾自由行
        </h1>
        <p className="text-base text-slate-600 font-light tracking-widest italic text-right absolute right-0" style={{ bottom: '-30px' }}>2026 · 2/4 - 2/11</p>
      </div>
    </div>
  );

  const DayCard = ({ data, isOpen, onClick }) => (
    <div className="mb-6 overflow-hidden bg-white rounded-2xl mx-4 shadow-md border border-slate-200 transition-all duration-300 hover:shadow-lg">
      <div 
        onClick={onClick}
        className="px-6 py-8 flex justify-between items-start cursor-pointer hover:bg-slate-50 transition-all duration-200 rounded-t-2xl"
      >
        <div className="flex gap-6 items-start">
          <div className="flex flex-col items-center justify-center w-14 text-slate-700 bg-gradient-to-br from-indigo-100 to-teal-100 rounded-xl px-4 py-3 shadow-sm border border-indigo-200">
            <span className="text-xs font-medium tracking-widest text-indigo-700">DAY</span>
            <span className="text-3xl font-light mt-1 text-slate-800">{data.day}</span>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 text-xl mb-2 tracking-wide">{data.date}</h3>
            <p className="text-slate-600 text-base font-light leading-relaxed">{data.title}</p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={22} className="text-indigo-600 mt-1" strokeWidth={2} /> : <ChevronDown size={22} className="text-indigo-600 mt-1" strokeWidth={2} />}
      </div>

      {isOpen && (
        <div className="px-6 pb-8 pt-5">
          {/* Hotel Info */}
          <div className="flex items-center gap-3 mb-8 mt-2 text-base text-slate-700 border-l-4 border-indigo-400 pl-4 bg-indigo-50 py-3 rounded-r-lg">
            <Home size={18} className="text-indigo-600" strokeWidth={2} />
            <span className="font-medium">{data.hotel}</span>
          </div>

          <div className="relative pl-12 space-y-8 before:content-[''] before:absolute before:left-[18px] before:top-2 before:bottom-2 before:w-[3px] before:bg-gradient-to-b before:from-indigo-300 before:via-teal-300 before:to-slate-300 before:rounded-full">
            {data.steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <div className="absolute left-[-22px] top-2 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 shadow-md border-[3px] border-white"></div>
                
                {/* 第一個景點的交通方式（到達此景點） */}
                {idx === 0 && step.transportToHere && (
                  <div className="mb-4 relative">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-3 rounded-lg border-2 border-teal-200 shadow-sm">
                      <MapPin size={18} className="text-teal-600 flex-shrink-0" strokeWidth={2} />
                      <span className="text-sm text-teal-800 font-medium leading-relaxed">{step.transportToHere}</span>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <span className="text-sm text-slate-700 font-medium tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">
                    {step.time}
                  </span>
                  {step.guideTag && (
                    <span className="ml-3 text-xs text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-full font-medium border border-indigo-300">
                      {step.guideTag}
                    </span>
                  )}
                </div>

                <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border-2 border-slate-200 shadow-md">
                  <div className="flex gap-4 items-start">
                    <div className="mt-1">{getIcon(step.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800 text-lg mb-3 tracking-wide">{step.title}</h4>
                      <p className="text-slate-600 text-base font-light leading-relaxed">{step.note}</p>
                    </div>
                  </div>
                  
                  {/* Recommendations Section */}
                  {step.recommendations && step.recommendations.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2 border-slate-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Star size={18} className="text-amber-500 fill-amber-500" strokeWidth={2} />
                        <h5 className="font-medium text-slate-800 text-base tracking-wide">推薦餐廳</h5>
                      </div>
                      <div className="space-y-4">
                        {step.recommendations.map((rec, recIdx) => (
                          <div 
                            key={recIdx}
                            className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-5 rounded-lg border-2 border-amber-200/60 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="mt-1 bg-amber-100 p-2 rounded-lg border border-amber-300">
                                <Utensils size={16} className="text-amber-700" strokeWidth={2} />
                              </div>
                              <div className="flex-1">
                                <h6 className="font-semibold text-slate-800 text-base mb-1.5 tracking-wide">
                                  {rec.restaurant}
                                </h6>
                                {rec.type && (
                                  <span className="inline-block text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-medium border border-amber-300 mb-2">
                                    {rec.type}
                                  </span>
                                )}
                                {rec.note && (
                                  <p className="text-slate-600 text-sm font-light leading-relaxed mt-2">
                                    {rec.note}
                                  </p>
                                )}
                              </div>
                            </div>
                            {rec.location && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); openMap(rec.location); }}
                                className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-amber-300 text-amber-700 text-sm py-2.5 hover:bg-amber-50 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                              >
                                <Map size={16} strokeWidth={2} />
                                查看位置
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.location && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); openMap(step.location); }}
                      className="mt-5 w-full flex items-center justify-center gap-2 border-2 border-indigo-300 text-indigo-700 text-base py-3 hover:bg-indigo-50 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                    >
                      <Navigation size={18} strokeWidth={2} />
                      導航
                    </button>
                  )}
                </div>

                {/* 交通方式（前往下一個景點） */}
                {step.transportToNext && (
                  <div className="mt-5 mb-2 relative">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-teal-50 px-5 py-3 rounded-lg border-2 border-indigo-200 shadow-sm">
                      <Train size={18} className="text-indigo-600 flex-shrink-0" strokeWidth={2} />
                      <span className="text-sm text-indigo-800 font-medium leading-relaxed">{step.transportToNext}</span>
                    </div>
                  </div>
                )}

                {/* 回飯店的交通方式（最後一個景點） */}
                {idx === data.steps.length - 1 && step.transportToHotel && (
                  <div className="mt-5 mb-2 relative">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-violet-50 to-purple-50 px-5 py-3 rounded-lg border-2 border-violet-200 shadow-sm">
                      <Home size={18} className="text-violet-600 flex-shrink-0" strokeWidth={2} />
                      <span className="text-sm text-violet-800 font-medium leading-relaxed">回飯店：{step.transportToHotel}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const InfoCard = ({ icon: Icon, title, content, subContent }) => (
    <div className="bg-white p-6 border-b border-slate-200 flex items-start gap-5 hover:bg-slate-50 transition-colors duration-200">
      <div className="text-indigo-600 mt-1 bg-indigo-100 p-3 rounded-lg border border-indigo-200">
        <Icon size={22} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-slate-800 text-lg mb-2 tracking-wide">{title}</h3>
        <p className="text-slate-600 text-base font-light">{content}</p>
        {subContent && <p className="text-slate-500 text-sm mt-3 font-light">{subContent}</p>}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-teal-50/30 min-h-screen pb-32 font-sans max-w-md mx-auto">
      
      {activeTab === 'itinerary' && (
        <>
          <WeatherWidget />
          <div className="px-0 pt-5">
            {itineraryData.map((day, index) => (
              <DayCard 
                key={index} 
                data={day} 
                isOpen={expandedDay === index}
                onClick={() => setExpandedDay(expandedDay === index ? -1 : index)}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === 'info' && (
        <div className="px-6 pt-12 pb-8">
          <h2 className="text-4xl font-light text-slate-800 mb-12 tracking-wider">旅程資訊</h2>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-indigo-700 uppercase tracking-widest mb-6 pl-1">住宿</h3>
            <div className="bg-white mb-10 rounded-2xl overflow-hidden shadow-md border-2 border-slate-200">
              {travelInfo.accommodations.map((item, index) => (
                <InfoCard 
                  key={index}
                  icon={Home} 
                  title={item.title} 
                  content={item.content} 
                  subContent={item.subContent} 
                />
              ))}
            </div>

            <h3 className="text-sm font-medium text-indigo-700 uppercase tracking-widest mb-6 mt-8 pl-1">航班</h3>
            <div className="bg-white mb-10 rounded-2xl overflow-hidden shadow-md border-2 border-slate-200">
              {travelInfo.flights.map((item, index) => (
                <InfoCard 
                  key={index}
                  icon={Plane} 
                  title={item.title} 
                  content={item.content} 
                  subContent={item.subContent} 
                />
              ))}
            </div>
            
            <h3 className="text-sm font-medium text-indigo-700 uppercase tracking-widest mb-6 mt-8 pl-1">緊急聯絡</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-slate-200">
              {travelInfo.emergencyContacts.map((item, index) => (
                <InfoCard 
                  key={index}
                  icon={Phone} 
                  title={item.title} 
                  content={item.content} 
                  subContent={item.subContent} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t-2 border-slate-200 px-6 py-6 flex justify-center items-center z-50 gap-20 shadow-lg">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center gap-2 transition-all duration-200 ${activeTab === 'itinerary' ? 'text-indigo-700' : 'text-slate-400'}`}
        >
          <div className={`p-3 rounded-xl transition-all duration-200 ${activeTab === 'itinerary' ? 'bg-indigo-100 shadow-md border-2 border-indigo-200' : ''}`}>
            <Calendar size={24} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
          </div>
          <span className="text-xs font-medium tracking-wide">行程</span>
        </button>

        <button 
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-2 transition-all duration-200 ${activeTab === 'info' ? 'text-indigo-700' : 'text-slate-400'}`}
        >
          <div className={`p-3 rounded-xl transition-all duration-200 ${activeTab === 'info' ? 'bg-indigo-100 shadow-md border-2 border-indigo-200' : ''}`}>
            <Info size={24} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
          </div>
          <span className="text-xs font-medium tracking-wide">資訊</span>
        </button>
      </div>
    </div>
  );
};

export default SeoulTravelApp;