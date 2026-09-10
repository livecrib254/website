import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ChatWidget from './components/ChatWidget.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

import SmsLogin from './apps/sms/SmsLogin.jsx'
import SmsDashboard from './apps/sms/SmsDashboard.jsx'
import RmsLogin from './apps/rms/RmsLogin.jsx'
import RmsDashboard from './apps/rms/RmsDashboard.jsx'

// Marketing layout with shared chrome
function SiteLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Marketing site */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Product demos — standalone (no marketing chrome) */}
        <Route path="/apps/sms/login" element={<SmsLogin />} />
        <Route path="/apps/sms/dashboard" element={<SmsDashboard />} />
        <Route path="/apps/rms/login" element={<RmsLogin />} />
        <Route path="/apps/rms/dashboard" element={<RmsDashboard />} />
      </Routes>
    </>
  )
}
